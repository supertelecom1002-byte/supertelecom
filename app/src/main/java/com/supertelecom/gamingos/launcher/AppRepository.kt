package com.supertelecom.gamingos.launcher

import android.app.Activity
import android.app.role.RoleManager
import android.content.Context
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.content.pm.PackageManager
import android.graphics.drawable.Drawable
import android.os.Build
import android.provider.Settings
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class AppItem(
    val label: String,
    val packageName: String,
    val activityName: String,
    val icon: Drawable?,
    val isGame: Boolean
)

class AppRepository(private val context: Context) {

    private val packageManager: PackageManager = context.packageManager

    // Popular game signatures for auto-detection heuristics
    private val knownGameKeywords = listOf(
        "freefire",
        "pubg",
        "bgmi",
        "callofduty",
        "shooter",
        "genshin",
        "asphalt",
        "roblox",
        "minecraft",
        "brawlstars",
        "clashofclans",
        "shadowfight",
        "subwaysurfers",
        "supercell",
        "ea.gp",
        "gameloft",
        "krafton",
        "riotgames",
        "epicgames"
    )

    suspend fun loadInstalledApps(): Pair<List<AppItem>, List<AppItem>> = withContext(Dispatchers.IO) {
        val launcherIntent = Intent(Intent.ACTION_MAIN, null).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
        }

        val resolveInfos = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            packageManager.queryIntentActivities(
                launcherIntent,
                PackageManager.ResolveInfoFlags.of(0)
            )
        } else {
            @Suppress("DEPRECATION")
            packageManager.queryIntentActivities(launcherIntent, 0)
        }

        val allApps = mutableListOf<AppItem>()
        val games = mutableListOf<AppItem>()
        val selfPackage = context.packageName

        for (resolveInfo in resolveInfos) {
            val pkg = resolveInfo.activityInfo.packageName
            if (pkg == selfPackage) continue // Skip self in launcher grid

            val label = resolveInfo.loadLabel(packageManager).toString()
            val icon = resolveInfo.loadIcon(packageManager)
            val activityName = resolveInfo.activityInfo.name

            val isGame = isApplicationGame(pkg)

            val item = AppItem(
                label = label,
                packageName = pkg,
                activityName = activityName,
                icon = icon,
                isGame = isGame
            )

            allApps.add(item)
            if (isGame) {
                games.add(item)
            }
        }

        val sortedApps = allApps.sortedBy { it.label.lowercase() }
        val sortedGames = games.sortedBy { it.label.lowercase() }

        Pair(sortedApps, sortedGames)
    }

    private fun isApplicationGame(packageName: String): Boolean {
        try {
            val appInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                packageManager.getApplicationInfo(
                    packageName,
                    PackageManager.ApplicationInfoFlags.of(0)
                )
            } else {
                @Suppress("DEPRECATION")
                packageManager.getApplicationInfo(packageName, 0)
            }

            // 1. Android official category check (API 26+)
            if (appInfo.category == ApplicationInfo.CATEGORY_GAME) {
                return true
            }

            // 2. Package heuristic matching
            val lowerPkg = packageName.lowercase()
            for (keyword in knownGameKeywords) {
                if (lowerPkg.contains(keyword)) {
                    return true
                }
            }
        } catch (_: Exception) {
            // Ignore unresolvable app info
        }
        return false
    }

    fun launchApp(packageName: String): Boolean {
        return try {
            val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
            if (launchIntent != null) {
                launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(launchIntent)
                true
            } else {
                false
            }
        } catch (_: Exception) {
            false
        }
    }

    fun isDefaultLauncher(): Boolean {
        val intent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_HOME)
        }
        val resolveInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            packageManager.resolveActivity(intent, PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_DEFAULT_ONLY.toLong()))
        } else {
            @Suppress("DEPRECATION")
            packageManager.resolveActivity(intent, PackageManager.MATCH_DEFAULT_ONLY)
        }
        return resolveInfo?.activityInfo?.packageName == context.packageName
    }

    fun requestDefaultLauncherRole(activity: Activity) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            val roleManager = activity.getSystemService(RoleManager::class.java)
            if (roleManager != null && roleManager.isRoleAvailable(RoleManager.ROLE_HOME)) {
                if (!roleManager.isRoleHeld(RoleManager.ROLE_HOME)) {
                    val intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_HOME)
                    activity.startActivityForResult(intent, REQUEST_ROLE_HOME)
                    return
                }
            }
        }

        // Fallback: Launch Home Settings
        val homeSettingsIntent = Intent(Settings.ACTION_HOME_SETTINGS).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            activity.startActivity(homeSettingsIntent)
        } catch (_: Exception) {
            activity.startActivity(Intent(Settings.ACTION_SETTINGS).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            })
        }
    }

    companion object {
        const val REQUEST_ROLE_HOME = 1001
    }
}

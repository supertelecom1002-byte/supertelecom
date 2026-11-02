package com.supertelecom

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.SharedPreferences
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.unit.dp
import androidx.lifecycle.lifecycleScope
import com.supertelecom.feature.launcher.AppRepository
import com.supertelecom.feature.launcher.SuperLauncherScreen
import com.supertelecom.model.AppItem
import com.supertelecom.theme.SuperTelecomTheme
import kotlinx.coroutines.launch

/**
 * Dedicated Native Android Home Launcher Activity
 * Declared with android.intent.category.HOME and android.intent.category.DEFAULT.
 * Separated from MainActivity dashboard to prevent task confusion.
 */
class HomeLauncherActivity : ComponentActivity() {

    private lateinit var appRepository: AppRepository
    private lateinit var prefs: SharedPreferences

    private var allAppsState by mutableStateOf<List<AppItem>>(emptyList())
    private var isDefaultLauncherState by mutableStateOf(false)
    private var isHindi by mutableStateOf(false)

    private val timeTickReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            // Live time broadcast listener - triggers recomposition if needed
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        appRepository = AppRepository(this)
        prefs = getSharedPreferences("super_telecom_launcher_prefs", Context.MODE_PRIVATE)
        isHindi = prefs.getBoolean("is_hindi", false)

        // As a Home Activity, back press should NOT exit to empty/black screen
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Keep launcher running on Home press
            }
        })

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_TIME_TICK)
            addAction(Intent.ACTION_TIME_CHANGED)
            addAction(Intent.ACTION_TIMEZONE_CHANGED)
        }
        registerReceiver(timeTickReceiver, filter)

        loadApps()

        setContent {
            SuperTelecomTheme {
                SuperLauncherScreen(
                    isHindi = isHindi,
                    allApps = allAppsState,
                    isDefaultLauncher = isDefaultLauncherState,
                    appRepository = appRepository,
                    bottomPadding = 24.dp
                )
            }
        }
    }

    override fun onResume() {
        super.onResume()
        isDefaultLauncherState = appRepository.isDefaultLauncher()
        loadApps()
    }

    override fun onDestroy() {
        super.onDestroy()
        try {
            unregisterReceiver(timeTickReceiver)
        } catch (_: Exception) {}
    }

    private fun loadApps() {
        lifecycleScope.launch {
            allAppsState = appRepository.loadInstalledApps()
        }
    }
}

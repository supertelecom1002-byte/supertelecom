package com.supertelecom.feature.launcher

import android.app.Activity
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.AppItem
import com.supertelecom.model.LauncherTheme
import com.supertelecom.theme.*
import java.text.SimpleDateFormat
import java.util.*

@Composable
fun SuperLauncherScreen(
    isHindi: Boolean,
    allApps: List<AppItem>,
    isDefaultLauncher: Boolean,
    appRepository: AppRepository,
    bottomPadding: androidx.compose.ui.unit.Dp = 110.dp
) {
    val context = LocalContext.current
    val launcherPrefs = remember {
        context.getSharedPreferences("supertelecom_launcher_prefs", Context.MODE_PRIVATE)
    }
    val savedThemeName = launcherPrefs.getString("launcher_theme", LauncherTheme.MINIMAL.name)
    val initialTheme = try {
        LauncherTheme.valueOf(savedThemeName ?: LauncherTheme.MINIMAL.name)
    } catch (_: Exception) {
        LauncherTheme.MINIMAL
    }
    var currentTheme by remember { mutableStateOf(initialTheme) }
    var searchQuery by remember { mutableStateOf("") }

    var currentTime by remember {
        mutableStateOf(SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date()))
    }
    var currentDate by remember {
        mutableStateOf(SimpleDateFormat("EEEE, d MMMM", Locale.getDefault()).format(Date()))
    }

    DisposableEffect(context) {
        val receiver = object : BroadcastReceiver() {
            override fun onReceive(ctx: Context?, intent: Intent?) {
                currentTime = SimpleDateFormat("HH:mm", Locale.getDefault()).format(Date())
                currentDate = SimpleDateFormat("EEEE, d MMMM", Locale.getDefault()).format(Date())
            }
        }
        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_TIME_TICK)
            addAction(Intent.ACTION_TIME_CHANGED)
            addAction(Intent.ACTION_TIMEZONE_CHANGED)
        }
        context.registerReceiver(receiver, filter)
        onDispose {
            try {
                context.unregisterReceiver(receiver)
            } catch (_: Exception) {}
        }
    }

    val filteredApps = remember(searchQuery, allApps) {
        if (searchQuery.isBlank()) {
            allApps
        } else {
            allApps.filter { it.label.contains(searchQuery, ignoreCase = true) }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                when (currentTheme) {
                    LauncherTheme.MINIMAL -> Color(0xFF000000)
                    LauncherTheme.IOS_INSPIRED -> Color(0xFF090D16)
                    LauncherTheme.PIXEL_INSPIRED -> Color(0xFF0F172A)
                    LauncherTheme.CLASSIC -> BgDark
                }
            )
            .statusBarsPadding()
            .padding(start = 16.dp, end = 16.dp, top = 8.dp)
    ) {
        // ── TOP 2 SYSTEM ACTION BUTTONS ──
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Set as Default Home Button
            Button(
                onClick = {
                    if (context is Activity) {
                        appRepository.requestDefaultLauncherRole(context)
                    }
                },
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isDefaultLauncher) EmeraldAccent.copy(alpha = 0.2f) else CyanAccent,
                    contentColor = if (isDefaultLauncher) EmeraldAccent else BgDark
                ),
                border = if (isDefaultLauncher) androidx.compose.foundation.BorderStroke(1.dp, EmeraldAccent) else null
            ) {
                Icon(
                    imageVector = if (isDefaultLauncher) Icons.Default.CheckCircle else Icons.Default.Home,
                    contentDescription = null,
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isDefaultLauncher)
                        (if (isHindi) "डिफ़ॉल्ट सक्रिय" else "Default Active")
                    else
                        (if (isHindi) "डिफ़ॉल्ट बनाएं" else "Set Default Home"),
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 11.sp)
                )
            }

            // Restore Original Launcher Button
            Button(
                onClick = {
                    if (context is Activity) {
                        appRepository.openHomeSettings(context)
                    }
                },
                modifier = Modifier
                    .weight(1f)
                    .height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = RoseAccent.copy(alpha = 0.15f),
                    contentColor = RoseAccent
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, RoseAccent.copy(alpha = 0.4f))
            ) {
                Icon(Icons.Default.SettingsBackupRestore, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isHindi) "पुराना लॉन्चर वापस" else "Restore Launcher",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, fontSize = 11.sp)
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // ── 4 THEME SELECTION BUTTONS ──
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            ThemeSelectButton(
                title = if (isHindi) "1. मिनिमल" else "1. Minimal",
                isSelected = currentTheme == LauncherTheme.MINIMAL,
                modifier = Modifier.weight(1f),
                onClick = {
                    currentTheme = LauncherTheme.MINIMAL
                    launcherPrefs.edit().putString("launcher_theme", LauncherTheme.MINIMAL.name).apply()
                }
            )
            ThemeSelectButton(
                title = if (isHindi) "2. iOS स्टाइल" else "2. iOS",
                isSelected = currentTheme == LauncherTheme.IOS_INSPIRED,
                modifier = Modifier.weight(1f),
                onClick = {
                    currentTheme = LauncherTheme.IOS_INSPIRED
                    launcherPrefs.edit().putString("launcher_theme", LauncherTheme.IOS_INSPIRED.name).apply()
                }
            )
            ThemeSelectButton(
                title = if (isHindi) "3. पिक्सल" else "3. Pixel",
                isSelected = currentTheme == LauncherTheme.PIXEL_INSPIRED,
                modifier = Modifier.weight(1f),
                onClick = {
                    currentTheme = LauncherTheme.PIXEL_INSPIRED
                    launcherPrefs.edit().putString("launcher_theme", LauncherTheme.PIXEL_INSPIRED.name).apply()
                }
            )
            ThemeSelectButton(
                title = if (isHindi) "4. क्लासिक" else "4. Classic",
                isSelected = currentTheme == LauncherTheme.CLASSIC,
                modifier = Modifier.weight(1f),
                onClick = {
                    currentTheme = LauncherTheme.CLASSIC
                    launcherPrefs.edit().putString("launcher_theme", LauncherTheme.CLASSIC.name).apply()
                }
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Clock & Date Widget (Adapts to Active Theme)
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = currentTime,
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontSize = 48.sp,
                    fontWeight = FontWeight.Light,
                    letterSpacing = 2.sp,
                    fontFamily = when (currentTheme) {
                        LauncherTheme.MINIMAL -> FontFamily.Monospace
                        else -> FontFamily.Default
                    },
                    color = when (currentTheme) {
                        LauncherTheme.PIXEL_INSPIRED -> CyanGlow
                        LauncherTheme.IOS_INSPIRED -> Color(0xFFF1F5F9)
                        else -> TextPrimary
                    }
                )
            )
            Text(
                text = currentDate,
                style = MaterialTheme.typography.bodyLarge.copy(
                    fontWeight = FontWeight.Medium,
                    color = TextSecondary,
                    fontSize = 12.sp
                )
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = {
                Text(
                    text = if (isHindi) "ऐप्स खोजें... (Search apps)" else "Search apps...",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextMuted, fontSize = 12.sp)
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    tint = if (currentTheme == LauncherTheme.PIXEL_INSPIRED) CyanAccent else TextMuted
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(imageVector = Icons.Default.Clear, contentDescription = "Clear", tint = TextMuted)
                    }
                }
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp)
                .clip(
                    when (currentTheme) {
                        LauncherTheme.PIXEL_INSPIRED -> RoundedCornerShape(26.dp)
                        LauncherTheme.IOS_INSPIRED -> RoundedCornerShape(14.dp)
                        else -> RoundedCornerShape(12.dp)
                    }
                )
                .background(CardDark),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyanAccent,
                unfocusedBorderColor = CardBorder,
                focusedTextColor = TextPrimary,
                unfocusedTextColor = TextPrimary
            ),
            singleLine = true
        )

        Spacer(modifier = Modifier.height(14.dp))

        // App Grid / Drawer
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(bottom = bottomPadding),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(filteredApps) { app ->
                AppGridItem(
                    app = app,
                    theme = currentTheme,
                    onClick = { appRepository.launchApp(app.packageName) }
                )
            }
        }
    }
}

@Composable
private fun ThemeSelectButton(
    title: String,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(44.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyanAccent else CardDark)
            .border(1.dp, if (isSelected) CyanAccent else CardBorder, RoundedCornerShape(10.dp))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 11.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) BgDark else TextSecondary
            )
        )
    }
}

@Composable
private fun AppGridItem(app: AppItem, theme: LauncherTheme, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(
            modifier = Modifier
                .size(52.dp)
                .clip(
                    when (theme) {
                        LauncherTheme.IOS_INSPIRED -> RoundedCornerShape(14.dp)
                        LauncherTheme.PIXEL_INSPIRED -> CircleShape
                        LauncherTheme.MINIMAL -> RoundedCornerShape(8.dp)
                        LauncherTheme.CLASSIC -> RoundedCornerShape(12.dp)
                    }
                )
                .background(CardDark)
                .border(
                    1.dp,
                    if (theme == LauncherTheme.PIXEL_INSPIRED) CyanAccent.copy(alpha = 0.4f) else CardBorder,
                    when (theme) {
                        LauncherTheme.IOS_INSPIRED -> RoundedCornerShape(14.dp)
                        LauncherTheme.PIXEL_INSPIRED -> CircleShape
                        LauncherTheme.MINIMAL -> RoundedCornerShape(8.dp)
                        LauncherTheme.CLASSIC -> RoundedCornerShape(12.dp)
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = app.label.take(1).uppercase(),
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = if (theme == LauncherTheme.PIXEL_INSPIRED) CyanGlow else TextPrimary
                )
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = app.label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                color = TextPrimary
            ),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

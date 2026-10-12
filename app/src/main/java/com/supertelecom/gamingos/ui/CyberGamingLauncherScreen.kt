package com.supertelecom.gamingos.ui

import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Gamepad
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Security
import androidx.compose.material.icons.filled.Speed
import androidx.compose.material.icons.filled.Thermostat
import androidx.compose.material.icons.filled.TrackChanges
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.gamingos.launcher.AppItem
import com.supertelecom.gamingos.service.FloatingCrosshairService
import com.supertelecom.gamingos.telemetry.HardwareTelemetryManager
import com.supertelecom.gamingos.theme.CyberBgBlack
import com.supertelecom.gamingos.theme.CyberBorderDark
import com.supertelecom.gamingos.theme.CyberNeonCyan
import com.supertelecom.gamingos.theme.CyberNeonEmerald
import com.supertelecom.gamingos.theme.CyberPurple
import com.supertelecom.gamingos.theme.CyberRed
import com.supertelecom.gamingos.theme.CyberSurfaceCard
import com.supertelecom.gamingos.theme.CyberSurfaceDark
import com.supertelecom.gamingos.theme.CyberTextMuted
import com.supertelecom.gamingos.theme.CyberTextWhite

@Composable
fun CyberGamingLauncherScreen(
    telemetryManager: HardwareTelemetryManager,
    allApps: List<AppItem>,
    games: List<AppItem>,
    isDefaultLauncher: Boolean,
    hasOverlayPermission: Boolean,
    isCrosshairActive: Boolean,
    onSetDefaultLauncher: () -> Unit,
    onRequestOverlayPermission: () -> Unit,
    onToggleCrosshair: () -> Unit,
    onLaunchApp: (String) -> Unit
) {
    val context = LocalContext.current
    val telemetry by telemetryManager.telemetryState.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    val filteredApps = remember(allApps, searchQuery) {
        if (searchQuery.isBlank()) allApps
        else allApps.filter { it.label.contains(searchQuery, ignoreCase = true) }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(CyberBgBlack)
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        // ==========================================
        // 1. TOP CYBER HUD BAR & BRANDING
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(CyberNeonEmerald)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "CYBER GAMING OS",
                        color = CyberTextWhite,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        letterSpacing = 1.sp
                    )
                }
                Text(
                    text = "SUPER TELECOM LAB • GIRIDIH",
                    color = CyberNeonCyan,
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }

            // Quick Lab Call Pill
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(CyberSurfaceDark)
                    .border(1.dp, CyberNeonCyan.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .clickable {
                        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+918002903643"))
                        context.startActivity(intent)
                    }
                    .padding(horizontal = 10.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Phone,
                    contentDescription = "Call Lab",
                    tint = CyberNeonEmerald,
                    modifier = Modifier.size(14.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = "LAB HOTLINE",
                    color = CyberTextWhite,
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // ==========================================
        // 2. REAL HARDWARE TELEMETRY METERS STRIP
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState())
                .padding(bottom = 14.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Display Refresh Rate
            TelemetryPill(
                icon = Icons.Default.Speed,
                label = "REFRESH",
                value = "${telemetry.displayRefreshRateHz}Hz",
                accentColor = CyberNeonCyan
            )

            // Battery & Temperature
            TelemetryPill(
                icon = Icons.Default.Thermostat,
                label = "BATTERY",
                value = "${telemetry.batteryPercent}% • ${telemetry.batteryTempCelsius}°C",
                accentColor = if (telemetry.batteryTempCelsius > 39f) CyberRed else CyberNeonEmerald
            )

            // Active RAM Utilization
            TelemetryPill(
                icon = Icons.Default.Security,
                label = "MEMORY",
                value = "${telemetry.usedRamGb}/${telemetry.totalRamGb}GB",
                accentColor = CyberPurple
            )

            // Thermal Status
            TelemetryPill(
                icon = Icons.Default.Speed,
                label = "THERMAL",
                value = telemetry.thermalStatus,
                accentColor = if (telemetry.isThermalThrottling) CyberRed else CyberNeonEmerald
            )
        }

        // ==========================================
        // 3. SYSTEM LAUNCHER & CROSSHAIR ACTION HUDS
        // ==========================================
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 14.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Home Launcher Role Card
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(CyberSurfaceCard)
                    .border(
                        1.dp,
                        if (isDefaultLauncher) CyberNeonEmerald.copy(alpha = 0.5f) else CyberBorderDark,
                        RoundedCornerShape(16.dp)
                    )
                    .clickable { onSetDefaultLauncher() }
                    .padding(12.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "DEFAULT HOME",
                            color = CyberTextMuted,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )
                        Icon(
                            imageVector = Icons.Default.Home,
                            contentDescription = null,
                            tint = if (isDefaultLauncher) CyberNeonEmerald else CyberNeonCyan,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (isDefaultLauncher) "ACTIVE LAUNCHER" else "TAP TO SET ROLE",
                        color = if (isDefaultLauncher) CyberNeonEmerald else CyberTextWhite,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }

            // Floating Crosshair Overlay Card
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(16.dp))
                    .background(CyberSurfaceCard)
                    .border(
                        1.dp,
                        if (isCrosshairActive) CyberNeonCyan.copy(alpha = 0.6f) else CyberBorderDark,
                        RoundedCornerShape(16.dp)
                    )
                    .clickable {
                        if (hasOverlayPermission) {
                            onToggleCrosshair()
                        } else {
                            onRequestOverlayPermission()
                        }
                    }
                    .padding(12.dp)
            ) {
                Column {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "HUD CROSSHAIR",
                            color = CyberTextMuted,
                            fontSize = 10.sp,
                            fontFamily = FontFamily.Monospace,
                            fontWeight = FontWeight.Bold
                        )
                        Icon(
                            imageVector = Icons.Default.TrackChanges,
                            contentDescription = null,
                            tint = if (isCrosshairActive) CyberNeonCyan else CyberTextMuted,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = if (isCrosshairActive) "OVERLAY ON" else if (hasOverlayPermission) "TAP TO ACTIVATE" else "GRANT PERMISSION",
                        color = if (isCrosshairActive) CyberNeonCyan else CyberTextWhite,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace
                    )
                }
            }
        }

        // ==========================================
        // 4. GAME TURBO VAULT CAROUSEL
        // ==========================================
        if (games.isNotEmpty()) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "GAME VAULT (${games.size})",
                    color = CyberNeonCyan,
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp
                )
                Text(
                    text = "AUTO-BOOST READY",
                    color = CyberNeonEmerald,
                    fontSize = 10.sp,
                    fontFamily = FontFamily.Monospace
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(bottom = 14.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                for (game in games) {
                    GameCard(
                        game = game,
                        onLaunch = {
                            triggerHaptic(context)
                            onLaunchApp(game.packageName)
                        }
                    )
                }
            }
        }

        // ==========================================
        // 5. ALL APPS SEARCH DRAWER
        // ==========================================
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = {
                Text(
                    text = "Search all installed apps...",
                    color = CyberTextMuted,
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = "Search",
                    tint = CyberNeonCyan,
                    modifier = Modifier.size(18.dp)
                )
            },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Clear",
                        tint = CyberTextMuted,
                        modifier = Modifier
                            .size(16.dp)
                            .clickable { searchQuery = "" }
                    )
                }
            },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = CyberNeonCyan,
                unfocusedBorderColor = CyberBorderDark,
                focusedTextColor = CyberTextWhite,
                unfocusedTextColor = CyberTextWhite,
                cursorColor = CyberNeonCyan
            ),
            shape = RoundedCornerShape(14.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 10.dp)
        )

        // All Apps 4-Column Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filteredApps, key = { it.packageName }) { app ->
                AppGridItem(
                    app = app,
                    onClick = {
                        triggerHaptic(context)
                        onLaunchApp(app.packageName)
                    }
                )
            }
        }
    }
}

@Composable
fun TelemetryPill(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    accentColor: Color
) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(CyberSurfaceCard)
            .border(1.dp, CyberBorderDark, RoundedCornerShape(12.dp))
            .padding(horizontal = 10.dp, vertical = 7.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = accentColor,
            modifier = Modifier.size(14.dp)
        )
        Spacer(modifier = Modifier.width(6.dp))
        Column {
            Text(
                text = label,
                color = CyberTextMuted,
                fontSize = 8.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = value,
                color = CyberTextWhite,
                fontSize = 11.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Black
            )
        }
    }
}

@Composable
fun GameCard(
    game: AppItem,
    onLaunch: () -> Unit
) {
    Box(
        modifier = Modifier
            .width(135.dp)
            .clip(RoundedCornerShape(18.dp))
            .background(
                Brush.verticalGradient(
                    colors = listOf(CyberSurfaceCard, CyberSurfaceDark)
                )
            )
            .border(1.dp, CyberNeonCyan.copy(alpha = 0.5f), RoundedCornerShape(18.dp))
            .clickable { onLaunch() }
            .padding(12.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
        ) {
            AppIconRenderer(
                drawable = game.icon,
                modifier = Modifier.size(48.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = game.label,
                color = CyberTextWhite,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(CyberNeonCyan)
                    .padding(vertical = 5.dp),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "BOOST & PLAY",
                    color = CyberBgBlack,
                    fontSize = 9.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.Black
                )
            }
        }
    }
}

@Composable
fun AppGridItem(
    app: AppItem,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .clickable { onClick() }
            .padding(vertical = 8.dp, horizontal = 4.dp)
    ) {
        AppIconRenderer(
            drawable = app.icon,
            modifier = Modifier.size(46.dp)
        )

        Spacer(modifier = Modifier.height(6.dp))

        Text(
            text = app.label,
            color = CyberTextWhite,
            fontSize = 11.sp,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun AppIconRenderer(
    drawable: Drawable?,
    modifier: Modifier = Modifier
) {
    val bitmap = remember(drawable) {
        drawable?.let { drawableToBitmap(it) }
    }

    if (bitmap != null) {
        Image(
            bitmap = bitmap.asImageBitmap(),
            contentDescription = null,
            modifier = modifier
        )
    } else {
        Box(
            modifier = modifier
                .clip(RoundedCornerShape(12.dp))
                .background(CyberSurfaceCard),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Gamepad,
                contentDescription = null,
                tint = CyberNeonCyan
            )
        }
    }
}

fun drawableToBitmap(drawable: Drawable): Bitmap {
    if (drawable is BitmapDrawable && drawable.bitmap != null) {
        return drawable.bitmap
    }
    val width = if (drawable.intrinsicWidth > 0) drawable.intrinsicWidth else 96
    val height = if (drawable.intrinsicHeight > 0) drawable.intrinsicHeight else 96
    val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, canvas.width, canvas.height)
    drawable.draw(canvas)
    return bitmap
}

fun triggerHaptic(context: Context) {
    try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator?.vibrate(
                VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK)
            )
        } else {
            @Suppress("DEPRECATION")
            val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            vibrator?.vibrate(
                VibrationEffect.createOneShot(20, VibrationEffect.DEFAULT_AMPLITUDE)
            )
        }
    } catch (_: Exception) {
        // Safe vibration fallback
    }
}

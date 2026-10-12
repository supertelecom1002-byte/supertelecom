package com.supertelecom.gamingos.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = CyberNeonCyan,
    onPrimary = CyberBgBlack,
    secondary = CyberNeonEmerald,
    onSecondary = CyberBgBlack,
    tertiary = CyberPurple,
    background = CyberBgBlack,
    surface = CyberSurfaceDark,
    onBackground = CyberTextWhite,
    onSurface = CyberTextWhite,
    surfaceVariant = CyberSurfaceCard,
    outline = CyberBorderDark
)

@Composable
fun CyberGamingOSTheme(
    content: @Composable () -> Unit
) {
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as? Activity)?.window
            if (window != null) {
                window.statusBarColor = CyberBgBlack.toArgb()
                window.navigationBarColor = CyberBgBlack.toArgb()
                val controller = WindowCompat.getInsetsController(window, view)
                controller.isAppearanceLightStatusBars = false
                controller.isAppearanceLightNavigationBars = false
            }
        }
    }

    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = CyberTypography,
        content = content
    )
}

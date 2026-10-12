package com.supertelecom.gamingos

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.lifecycleScope
import com.supertelecom.gamingos.launcher.AppItem
import com.supertelecom.gamingos.launcher.AppRepository
import com.supertelecom.gamingos.service.FloatingCrosshairService
import com.supertelecom.gamingos.telemetry.HardwareTelemetryManager
import com.supertelecom.gamingos.theme.CyberGamingOSTheme
import com.supertelecom.gamingos.ui.CyberGamingLauncherScreen
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var telemetryManager: HardwareTelemetryManager
    private lateinit var appRepository: AppRepository

    private var allAppsState by mutableStateOf<List<AppItem>>(emptyList())
    private var gamesState by mutableStateOf<List<AppItem>>(emptyList())
    private var isDefaultLauncherState by mutableStateOf(false)
    private var hasOverlayPermissionState by mutableStateOf(false)
    private var isCrosshairActiveState by mutableStateOf(false)

    private val overlayPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) {
        hasOverlayPermissionState = Settings.canDrawOverlays(this)
        if (hasOverlayPermissionState) {
            FloatingCrosshairService.start(this)
            isCrosshairActiveState = true
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        telemetryManager = HardwareTelemetryManager(this)
        appRepository = AppRepository(this)

        // Intercept back button so launcher stays anchored on the home screen
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // Home launcher stays on home screen
            }
        })

        loadApps()

        setContent {
            CyberGamingOSTheme {
                CyberGamingLauncherScreen(
                    telemetryManager = telemetryManager,
                    allApps = allAppsState,
                    games = gamesState,
                    isDefaultLauncher = isDefaultLauncherState,
                    hasOverlayPermission = hasOverlayPermissionState,
                    isCrosshairActive = isCrosshairActiveState,
                    onSetDefaultLauncher = {
                        appRepository.requestDefaultLauncherRole(this)
                    },
                    onRequestOverlayPermission = {
                        requestOverlayPermission()
                    },
                    onToggleCrosshair = {
                        toggleCrosshair()
                    },
                    onLaunchApp = { packageName ->
                        appRepository.launchApp(packageName)
                    }
                )
            }
        }
    }

    override fun onStart() {
        super.onStart()
        telemetryManager.startListening()
    }

    override fun onResume() {
        super.onResume()
        isDefaultLauncherState = appRepository.isDefaultLauncher()
        hasOverlayPermissionState = Settings.canDrawOverlays(this)
        isCrosshairActiveState = FloatingCrosshairService.isRunning
        telemetryManager.pollSystemMetrics()
    }

    override fun onStop() {
        super.onStop()
        telemetryManager.stopListening()
    }

    private fun loadApps() {
        lifecycleScope.launch {
            val (apps, games) = appRepository.loadInstalledApps()
            allAppsState = apps
            gamesState = games
        }
    }

    private fun requestOverlayPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
            overlayPermissionLauncher.launch(intent)
        } else {
            hasOverlayPermissionState = true
            toggleCrosshair()
        }
    }

    private fun toggleCrosshair() {
        if (FloatingCrosshairService.isRunning) {
            FloatingCrosshairService.stop(this)
            isCrosshairActiveState = false
        } else {
            if (Settings.canDrawOverlays(this)) {
                FloatingCrosshairService.start(this)
                isCrosshairActiveState = true
            } else {
                requestOverlayPermission()
            }
        }
    }
}

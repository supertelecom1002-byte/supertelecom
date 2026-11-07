package com.supertelecom

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.lifecycleScope
import com.supertelecom.feature.home.HomeScreen
import com.supertelecom.feature.launcher.AppRepository
import com.supertelecom.feature.more.MoreFeaturesScreen
import com.supertelecom.feature.recover.SuperRecoverScreen
import com.supertelecom.feature.transfer.SuperTransferScreen
import com.supertelecom.feature.update.AppUpdateManager
import com.supertelecom.model.AppItem
import com.supertelecom.model.NavTab
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.TransferDirection
import com.supertelecom.theme.*
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var appRepository: AppRepository
    private lateinit var updateManager: AppUpdateManager

    private var allAppsState by mutableStateOf<List<AppItem>>(emptyList())
    private var isDefaultLauncherState by mutableStateOf(false)
    private var currentTab by mutableStateOf(NavTab.HOME)
    private var isHindi by mutableStateOf(false)

    private var initialTransferDirection by mutableStateOf<TransferDirection?>(null)
    private var initialRecoverCategory by mutableStateOf<RecoverCategory?>(null)

    private var lastBackPressTime = 0L

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        appRepository = AppRepository(this)
        updateManager = AppUpdateManager.getInstance(this)

        // Custom back dispatcher: double-back-to-exit on HOME, back to HOME from other tabs
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (currentTab != NavTab.HOME) {
                    currentTab = NavTab.HOME
                } else {
                    val now = System.currentTimeMillis()
                    if (now - lastBackPressTime < 2000L) {
                        finish()
                    } else {
                        lastBackPressTime = now
                        val msg = if (isHindi) "बाहर निकलने के लिए फिर से बैक दबाएं" else "Press back again to exit"
                        Toast.makeText(this@MainActivity, msg, Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })

        loadApps()

        setContent {
            SuperTelecomTheme {
                Scaffold(
                    bottomBar = {
                        NavigationBar(
                            containerColor = CardDark,
                            tonalElevation = 8.dp,
                            modifier = Modifier
                                .border(1.dp, CardBorder)
                        ) {
                            NavTab.values().forEach { tab ->
                                val isSelected = currentTab == tab
                                NavigationBarItem(
                                    selected = isSelected,
                                    onClick = { currentTab = tab },
                                    icon = {
                                        Icon(
                                            imageVector = tab.icon,
                                            contentDescription = tab.titleEn,
                                            modifier = Modifier.size(20.dp)
                                        )
                                    },
                                    label = {
                                        Text(
                                            text = if (isHindi) tab.titleHi else tab.titleEn,
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontSize = 11.sp,
                                                fontWeight = if (isSelected) androidx.compose.ui.text.font.FontWeight.Bold else androidx.compose.ui.text.font.FontWeight.Normal
                                            )
                                        )
                                    },
                                    colors = NavigationBarItemDefaults.colors(
                                        selectedIconColor = BgDark,
                                        selectedTextColor = CyanAccent,
                                        indicatorColor = CyanAccent,
                                        unselectedIconColor = TextMuted,
                                        unselectedTextColor = TextMuted
                                    )
                                )
                            }
                        }
                    },
                    containerColor = BgDark
                ) { paddingValues ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(top = paddingValues.calculateTopPadding())
                    ) {
                        val bottomInset = paddingValues.calculateBottomPadding() + 24.dp
                        val screenContentPadding = PaddingValues(
                            start = 16.dp,
                            end = 16.dp,
                            top = 12.dp,
                            bottom = bottomInset.coerceAtLeast(110.dp)
                        )
                        when (currentTab) {
                            NavTab.HOME -> HomeScreen(
                                isHindi = isHindi,
                                onToggleLanguage = { isHindi = !isHindi },
                                onNavigateTab = { currentTab = it },
                                onNavigateTransfer = { dir ->
                                    initialTransferDirection = dir
                                    currentTab = NavTab.TRANSFER
                                },
                                onNavigateRecover = { cat ->
                                    initialRecoverCategory = cat
                                    currentTab = NavTab.RECOVER
                                },
                                contentPadding = screenContentPadding
                            )
                            NavTab.TRANSFER -> SuperTransferScreen(
                                isHindi = isHindi,
                                initialDirection = initialTransferDirection,
                                contentPadding = screenContentPadding
                            )
                            NavTab.RECOVER -> SuperRecoverScreen(
                                isHindi = isHindi,
                                initialCategory = initialRecoverCategory,
                                contentPadding = screenContentPadding
                            )
                            NavTab.MORE -> MoreFeaturesScreen(
                                isHindi = isHindi,
                                onToggleLanguage = { isHindi = !isHindi },
                                allApps = allAppsState,
                                isDefaultLauncher = isDefaultLauncherState,
                                appRepository = appRepository,
                                onNavigateTab = { currentTab = it },
                                contentPadding = screenContentPadding
                            )
                        }
                    }
                }
            }
        }
    }

    override fun onResume() {
        super.onResume()
        isDefaultLauncherState = appRepository.isDefaultLauncher()
        updateManager.onActivityResume(this)
    }

    private fun loadApps() {
        lifecycleScope.launch {
            allAppsState = appRepository.loadInstalledApps()
        }
    }
}

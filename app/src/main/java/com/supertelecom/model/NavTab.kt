package com.supertelecom.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.SwapHoriz
import androidx.compose.material.icons.filled.Restore
import androidx.compose.material.icons.filled.Apps
import androidx.compose.ui.graphics.vector.ImageVector

enum class NavTab(
    val titleEn: String,
    val titleHi: String,
    val icon: ImageVector
) {
    HOME("Home", "होम", Icons.Default.Home),
    TRANSFER("Transfer", "ट्रांसफर", Icons.Default.SwapHoriz),
    RECOVER("Recover", "रिकवर", Icons.Default.Restore),
    LAUNCHER("Launcher", "लॉन्चर", Icons.Default.Apps)
}

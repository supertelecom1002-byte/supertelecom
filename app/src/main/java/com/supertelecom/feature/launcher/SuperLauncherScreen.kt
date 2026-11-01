package com.supertelecom.feature.launcher

import android.app.Activity
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
    appRepository: AppRepository
) {
    val context = LocalContext.current
    var currentTheme by remember { mutableStateOf(LauncherTheme.MINIMAL) }
    var searchQuery by remember { mutableStateOf("") }
    var showThemeDialog by remember { mutableStateOf(false) }

    val currentTime = remember {
        val sdf = SimpleDateFormat("HH:mm", Locale.getDefault())
        sdf.format(Date())
    }
    val currentDate = remember {
        val sdf = SimpleDateFormat("EEEE, d MMMM", Locale.getDefault())
        sdf.format(Date())
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
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        // Top Control Row: Theme selector + Restore Original Launcher
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Theme Picker Button
            OutlinedButton(
                onClick = { showThemeDialog = true },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(CardBorder)),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
            ) {
                Icon(imageVector = Icons.Default.Palette, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isHindi) currentTheme.titleHi else currentTheme.titleEn,
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                )
            }

            // Restore Original Launcher Button
            Button(
                onClick = {
                    if (context is Activity) {
                        appRepository.openHomeSettings(context)
                    }
                },
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = RoseAccent.copy(alpha = 0.15f),
                    contentColor = RoseAccent
                ),
                contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp),
                modifier = Modifier.border(1.dp, RoseAccent.copy(alpha = 0.3f), RoundedCornerShape(12.dp))
            ) {
                Icon(imageVector = Icons.Default.SettingsBackupRestore, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isHindi) "पुराना लॉन्चर वापस लाएं" else "Restore Launcher",
                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                )
            }
        }

        Spacer(modifier = Modifier.height(18.dp))

        // Clock & Date Widget (Adapts to Theme)
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = currentTime,
                style = MaterialTheme.typography.headlineLarge.copy(
                    fontSize = 54.sp,
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
                    fontSize = 13.sp
                )
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Search Bar
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = {
                Text(
                    text = if (isHindi) "ऐप्स खोजें..." else "Search apps...",
                    style = MaterialTheme.typography.bodyMedium.copy(color = TextMuted)
                )
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Default.Search,
                    contentDescription = null,
                    tint = when (currentTheme) {
                        LauncherTheme.PIXEL_INSPIRED -> CyanAccent
                        else -> TextMuted
                    }
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
                .clip(
                    when (currentTheme) {
                        LauncherTheme.PIXEL_INSPIRED -> RoundedCornerShape(28.dp)
                        LauncherTheme.IOS_INSPIRED -> RoundedCornerShape(16.dp)
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

        Spacer(modifier = Modifier.height(16.dp))

        // Default Launcher Banner if not set
        if (!isDefaultLauncher) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CyanAccent.copy(alpha = 0.08f))
                    .border(1.dp, CyanAccent.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                    .clickable {
                        if (context is Activity) {
                            appRepository.requestDefaultLauncherRole(context)
                        }
                    }
                    .padding(10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.CheckCircleOutline, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "सुपर लॉन्चर को डिफॉल्ट बनाएं" else "Set as Default Home Launcher",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = CyanAccent)
                        )
                        Text(
                            text = if (isHindi) "टैप करें और 'Home app' में Super Telecom चुनें" else "Tap here and select Super Telecom as Default Home",
                            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 10.sp)
                        )
                    }
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // App Drawer Grid
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            modifier = Modifier.weight(1f),
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

    // Theme Switcher Dialog
    if (showThemeDialog) {
        AlertDialog(
            onDismissRequest = { showThemeDialog = false },
            title = {
                Text(
                    text = if (isHindi) "लॉन्चर थीम चुनें" else "Choose Launcher Theme",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    LauncherTheme.values().forEach { theme ->
                        val isSelected = theme == currentTheme
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) CyanAccent.copy(alpha = 0.15f) else CardDark)
                                .border(1.dp, if (isSelected) CyanAccent else CardBorder, RoundedCornerShape(12.dp))
                                .clickable {
                                    currentTheme = theme
                                    showThemeDialog = false
                                }
                                .padding(12.dp)
                        ) {
                            Column {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    RadioButton(
                                        selected = isSelected,
                                        onClick = {
                                            currentTheme = theme
                                            showThemeDialog = false
                                        },
                                        colors = RadioButtonDefaults.colors(selectedColor = CyanAccent)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = if (isHindi) theme.titleHi else theme.titleEn,
                                        style = MaterialTheme.typography.titleMedium.copy(fontSize = 14.sp, fontWeight = FontWeight.Bold)
                                    )
                                }
                                Text(
                                    text = theme.subtitleEn,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = TextMuted),
                                    modifier = Modifier.padding(start = 32.dp)
                                )
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showThemeDialog = false }) {
                    Text(text = if (isHindi) "पूर्ण" else "Done", color = CyanAccent)
                }
            },
            containerColor = CardDark
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
                .background(
                    when (theme) {
                        LauncherTheme.MINIMAL -> Color(0xFF1E293B)
                        LauncherTheme.IOS_INSPIRED -> Color(0xFF1E293B)
                        LauncherTheme.PIXEL_INSPIRED -> Color(0xFF1E293B)
                        LauncherTheme.CLASSIC -> CardDark
                    }
                )
                .border(
                    1.dp,
                    when (theme) {
                        LauncherTheme.MINIMAL -> Color(0xFF334155)
                        else -> CardBorder
                    },
                    when (theme) {
                        LauncherTheme.IOS_INSPIRED -> RoundedCornerShape(14.dp)
                        LauncherTheme.PIXEL_INSPIRED -> CircleShape
                        LauncherTheme.MINIMAL -> RoundedCornerShape(8.dp)
                        LauncherTheme.CLASSIC -> RoundedCornerShape(12.dp)
                    }
                ),
            contentAlignment = Alignment.Center
        ) {
            // App Initials as icon fallback
            Text(
                text = app.label.take(1).uppercase(),
                style = MaterialTheme.typography.titleLarge.copy(
                    fontWeight = FontWeight.Bold,
                    color = when (theme) {
                        LauncherTheme.PIXEL_INSPIRED -> CyanGlow
                        LauncherTheme.MINIMAL -> TextPrimary
                        else -> TextPrimary
                    }
                )
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        Text(
            text = app.label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 11.sp,
                textAlign = TextAlign.Center,
                color = when (theme) {
                    LauncherTheme.MINIMAL -> Color(0xFFCBD5E1)
                    else -> TextPrimary
                }
            ),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

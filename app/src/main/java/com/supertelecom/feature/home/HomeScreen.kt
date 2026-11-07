package com.supertelecom.feature.home

import android.app.Activity
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.R
import com.supertelecom.feature.update.AppUpdateManager
import com.supertelecom.feature.update.UpdateInstallState
import com.supertelecom.model.NavTab
import com.supertelecom.model.RecentTaskItem
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.TaskType
import com.supertelecom.model.TransferDirection
import com.supertelecom.theme.*

@Composable
fun HomeScreen(
    isHindi: Boolean,
    onToggleLanguage: () -> Unit,
    onNavigateTab: (NavTab) -> Unit,
    onNavigateTransfer: (TransferDirection) -> Unit = { onNavigateTab(NavTab.TRANSFER) },
    onNavigateRecover: (RecoverCategory) -> Unit = { onNavigateTab(NavTab.RECOVER) },
    recentTasks: List<RecentTaskItem> = emptyList(),
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val activity = context as? Activity
    val updateManager = remember { AppUpdateManager.getInstance(context) }
    val updateMetadata by updateManager.updateMetadata.collectAsState()
    val isDownloadingUpdate by updateManager.isDownloading.collectAsState()
    val downloadProgress by updateManager.downloadProgress.collectAsState()
    val updateStatusMsg by updateManager.statusMessage.collectAsState()
    val installState by updateManager.installState.collectAsState()

    var showStoreDialog by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        updateManager.checkForUpdates(manual = false)
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding(),
        contentPadding = contentPadding
    ) {
        item {
            // ── TOP BAR (OFFICIAL MASTER LOGO & BRANDING) ──
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Image(
                        painter = painterResource(id = R.drawable.super_telecom_logo_master),
                        contentDescription = "Super Telecom Official Logo",
                        modifier = Modifier
                            .size(46.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .border(1.dp, CyanAccent.copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                    )

                    Spacer(modifier = Modifier.width(10.dp))

                    Column {
                        Text(
                            text = "Super Telecom",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontWeight = FontWeight.Black,
                                color = TextPrimary,
                                fontSize = 18.sp
                            )
                        )
                        Text(
                            text = if (isHindi) "ट्रांसफर • रिकवरी • लॉन्चर सुइट" else "Transfer • Recover • Launcher Suite",
                            style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Language Switcher
                    Button(
                        onClick = onToggleLanguage,
                        colors = ButtonDefaults.buttonColors(containerColor = CardDark),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .height(38.dp)
                            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Translate,
                            contentDescription = null,
                            tint = CyanAccent,
                            modifier = Modifier.size(15.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isHindi) "ENG" else "हिंदी",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = TextPrimary
                            )
                        )
                    }

                    Spacer(modifier = Modifier.width(8.dp))

                    // More / Settings Shortcut
                    IconButton(
                        onClick = { onNavigateTab(NavTab.MORE) },
                        modifier = Modifier
                            .size(38.dp)
                            .background(CardDark, CircleShape)
                            .border(1.dp, CardBorder, CircleShape)
                    ) {
                        Icon(
                            imageVector = Icons.Default.MoreHoriz,
                            contentDescription = "More Features",
                            tint = TextSecondary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }
            }

            // ── IN-APP AUTO-UPDATE BANNER (SHOWN WHEN NEW VERSION DETECTED) ──
            updateMetadata?.let { meta ->
                Spacer(modifier = Modifier.height(14.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364)))
                        )
                        .border(1.5.dp, CyanAccent, RoundedCornerShape(16.dp))
                        .padding(14.dp)
                ) {
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Box(
                                    modifier = Modifier
                                        .size(36.dp)
                                        .background(CyanAccent.copy(alpha = 0.2f), CircleShape),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Default.SystemUpdate,
                                        contentDescription = null,
                                        tint = CyanAccent,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(
                                        text = if (isHindi) "नया ऐप अपडेट उपलब्ध है!" else "New App Update Available!",
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontWeight = FontWeight.Bold,
                                            color = CyanAccent,
                                            fontSize = 15.sp
                                        )
                                    )
                                    Text(
                                        text = "v${meta.versionName} (${meta.fileSizeHuman}) • In-Place Update",
                                        style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                                    )
                                }
                            }

                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(EmeraldAccent.copy(alpha = 0.2f))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = if (isHindi) "अपडेट" else "UPDATE",
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = EmeraldAccent,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 10.sp
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = if (isHindi)
                                "सुपर टेलीकॉम का नया वर्शन तैयार है। आपके मौजूदा ऐप में बिना डेटा खोए सीधा अपडेट होगा।"
                            else
                                "Latest official release with verified cryptographic signature and SHA-256 integrity check.",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextPrimary, fontSize = 11.sp)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        when (val state = installState) {
                            is UpdateInstallState.Downloading -> {
                                Column {
                                    LinearProgressIndicator(
                                        progress = { downloadProgress },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(6.dp)
                                            .clip(RoundedCornerShape(3.dp)),
                                        color = CyanAccent,
                                        trackColor = CardDark
                                    )
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = updateStatusMsg ?: "Downloading...",
                                            style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = TextMuted)
                                        )
                                        Text(
                                            text = "${(downloadProgress * 100).toInt()}%",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontSize = 10.sp,
                                                fontWeight = FontWeight.Bold,
                                                color = CyanAccent
                                            )
                                        )
                                    }
                                }
                            }
                            is UpdateInstallState.ReadyToInstall -> {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Button(
                                        onClick = {
                                            if (activity != null) {
                                                updateManager.triggerPackageInstaller(state.apkFile, activity)
                                            }
                                        },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(48.dp),
                                        shape = RoundedCornerShape(10.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                                    ) {
                                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(18.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = if (isHindi) "अभी इंस्टॉल करें (Ready to Install)" else "INSTALL NOW (Ready)",
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                                        )
                                    }
                                    Text(
                                        text = if (isHindi)
                                            "💡 यदि 'App not installed' दिखे तो पुराना ऐप अनइंस्टॉल करके यह नया लगाएं।"
                                        else
                                            "💡 If 'App not installed' appears, please uninstall the older version and install fresh.",
                                        style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = AmberAccent)
                                    )
                                }
                            }
                            else -> {
                                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                    Button(
                                        onClick = {
                                            if (activity != null) {
                                                updateManager.downloadAndInstallUpdate(meta, activity)
                                            }
                                        },
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .height(46.dp),
                                        shape = RoundedCornerShape(10.dp),
                                        colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                                    ) {
                                        Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = if (isHindi) "अभी अपडेट डाउनलोड करें (${meta.fileSizeHuman})" else "DOWNLOAD & INSTALL UPDATE (${meta.fileSizeHuman})",
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                                        )
                                    }
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = if (isHindi) "सिस्टम डाउनलोडर" else "System Downloader",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontSize = 10.sp,
                                                color = CyanAccent,
                                                fontWeight = FontWeight.Bold
                                            ),
                                            modifier = Modifier.clickable {
                                                updateManager.downloadViaSystemDownloadManager(meta)
                                            }
                                        )
                                        Text(
                                            text = if (isHindi) "ब्राउज़र से डाउनलोड" else "Browser Download",
                                            style = MaterialTheme.typography.labelSmall.copy(
                                                fontSize = 10.sp,
                                                color = TextSecondary,
                                                fontWeight = FontWeight.Medium
                                            ),
                                            modifier = Modifier.clickable {
                                                if (activity != null) {
                                                    updateManager.triggerBrowserDownloadFallback(activity)
                                                }
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // ── PRIVACY NOTICE STRIP (HONEST LOCAL ARCHITECTURE) ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(EmeraldAccent.copy(alpha = 0.08f))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.25f), RoundedCornerShape(14.dp))
                    .clickable { onNavigateTab(NavTab.MORE) }
                    .padding(horizontal = 14.dp, vertical = 10.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = null,
                        tint = EmeraldAccent,
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "100% ऑन-डिवाइस प्राइवेसी • शून्य क्लाउड अपलोड" else "100% ON-DEVICE PRIVACY • ZERO CLOUD UPLOADS",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = EmeraldAccent
                            )
                        )
                        Text(
                            text = if (isHindi) "सभी ट्रांसफर व रिकवरी केवल आपके फोन पर स्थानीय रूप से चलती हैं।" else "All file transfers & scans run locally on your phone. No tracking.",
                            style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp, color = TextSecondary)
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.ChevronRight,
                        contentDescription = null,
                        tint = EmeraldAccent,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── CARD 1: SUPER TRANSFER (PRIMARY HERO FEATURE) ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(listOf(Color(0xFF0C243B), Color(0xFF0F4C81), Color(0xFF0284C7)))
                    )
                    .border(1.dp, CyanAccent.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .background(Color.White.copy(alpha = 0.15f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Send, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = if (isHindi) "सुपर ट्रांसफर" else "Super Transfer",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Black,
                                        color = Color.White,
                                        fontSize = 18.sp
                                    )
                                )
                                Text(
                                    text = if (isHindi) "ऑफ़लाइन वाई-फाई डायरेक्ट" else "Offline Wi-Fi Direct & Hotspot",
                                    style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.White.copy(alpha = 0.15f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "UP TO 60 MB/S",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isHindi)
                            "बिना इंटरनेट या मोबाइल डेटा के एक फोन से दूसरे फोन में फोटो, वीडियो, गाने, ऐप्स और भारी फाइलें सीधे भेजें।"
                        else
                            "Send 4GB+ videos, photos, recordings and apps directly between nearby phones offline at maximum Wi-Fi speed.",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 12.sp,
                            lineHeight = 17.sp
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Prominent Touch-Friendly Action Buttons (Min 52dp height)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = { onNavigateTransfer(TransferDirection.SEND) },
                            modifier = Modifier
                                .weight(1f)
                                .height(52.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.White,
                                contentColor = Color(0xFF0C243B)
                            )
                        ) {
                            Icon(Icons.Default.ArrowUpward, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "फाइल भेजें" else "SEND FILES",
                                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Black)
                            )
                        }

                        Button(
                            onClick = { onNavigateTransfer(TransferDirection.RECEIVE) },
                            modifier = Modifier
                                .weight(1f)
                                .height(52.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color.Black.copy(alpha = 0.4f),
                                contentColor = Color.White
                            )
                        ) {
                            Icon(Icons.Default.ArrowDownward, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "फाइल प्राप्त करें" else "RECEIVE",
                                style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Black)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(18.dp))

            // ── CARD 2: SUPER RECOVER (PRIMARY HERO FEATURE) ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(
                        Brush.linearGradient(listOf(Color(0xFF064E3B), Color(0xFF065F46), Color(0xFF059669)))
                    )
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                    .padding(18.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(46.dp)
                                    .background(Color.White.copy(alpha = 0.15f), RoundedCornerShape(12.dp)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(Icons.Default.Restore, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = if (isHindi) "सुपर रिकवर" else "Super Recover",
                                    style = MaterialTheme.typography.titleLarge.copy(
                                        fontWeight = FontWeight.Black,
                                        color = Color.White,
                                        fontSize = 18.sp
                                    )
                                )
                                Text(
                                    text = if (isHindi) "ऑन-डिवाइस मीडिया स्कैनर" else "On-Device Storage Scanner",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent)
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(Color.White.copy(alpha = 0.15f))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "SAFE SCAN",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = if (isHindi)
                            "डिलीट हुई फोटो, वीडियो, ऑडियो रिकॉर्डिंग्स और डॉक्यूमेंट्स को अपने डिवाइस के स्टोरेज से खोजें और पुनः प्राप्त करें।"
                        else
                            "Find and restore deleted photos, videos, voice recordings & documents still retained on your phone.",
                        style = MaterialTheme.typography.bodyMedium.copy(
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 12.sp,
                            lineHeight = 17.sp
                        )
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // 4 Quick Scan Shortcut Buttons
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        ScanShortcutButton(
                            label = if (isHindi) "फोटो" else "Photos",
                            icon = Icons.Default.Image,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigateRecover(RecoverCategory.PHOTOS) }
                        )
                        ScanShortcutButton(
                            label = if (isHindi) "वीडियो" else "Videos",
                            icon = Icons.Default.Videocam,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigateRecover(RecoverCategory.VIDEOS) }
                        )
                        ScanShortcutButton(
                            label = if (isHindi) "ऑडियो" else "Audio",
                            icon = Icons.Default.Audiotrack,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigateRecover(RecoverCategory.AUDIO_RECORDINGS) }
                        )
                        ScanShortcutButton(
                            label = if (isHindi) "दस्तावेज़" else "Docs",
                            icon = Icons.Default.Description,
                            modifier = Modifier.weight(1f),
                            onClick = { onNavigateRecover(RecoverCategory.DOCUMENTS) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── SECONDARY SECTION: QUICK SHORTCUTS & TOOLS ──
            Text(
                text = if (isHindi) "त्वरित सुविधाएं व टूल्स" else "Quick Utilities & Services",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                QuickUtilityCard(
                    title = if (isHindi) "सुपर लॉन्चर" else "Super Launcher",
                    desc = if (isHindi) "4 क्लीन थीम्स" else "4 Custom Themes",
                    icon = Icons.Default.Smartphone,
                    accentColor = Color(0xFFA855F7),
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateTab(NavTab.MORE) }
                )

                QuickUtilityCard(
                    title = if (isHindi) "डायग्नोस्टिक्स" else "Diagnostics",
                    desc = if (isHindi) "हार्डवेयर व बैटरी" else "Specs & Battery",
                    icon = Icons.Default.Analytics,
                    accentColor = CyanAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateTab(NavTab.MORE) }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                QuickUtilityCard(
                    title = if (isHindi) "रिपेयर सपोर्ट" else "Repair Support",
                    desc = if (isHindi) "परामर्श व संपर्क" else "Lab Consultation",
                    icon = Icons.Default.Build,
                    accentColor = AmberAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { showStoreDialog = true }
                )

                QuickUtilityCard(
                    title = if (isHindi) "डेटा अधिकार" else "Data Controls",
                    desc = if (isHindi) "अनुमतियां व प्राइवेसी" else "Privacy & Permissions",
                    icon = Icons.Default.Security,
                    accentColor = EmeraldAccent,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigateTab(NavTab.MORE) }
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── STORE SHOWCASE (FLAGSHIP LAB) ──
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(18.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(18.dp))
            ) {
                Column {
                    Box(modifier = Modifier.fillMaxWidth().height(130.dp)) {
                        Image(
                            painter = painterResource(id = R.drawable.hero_repair),
                            contentDescription = "Super Telecom Lab",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(
                                    Brush.verticalGradient(
                                        listOf(Color.Transparent, BgDark.copy(alpha = 0.6f), BgDark)
                                    )
                                )
                        )
                        Box(
                            modifier = Modifier
                                .align(Alignment.TopEnd)
                                .padding(10.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(BgDark.copy(alpha = 0.85f))
                                .border(1.dp, CyanAccent.copy(alpha = 0.5f), RoundedCornerShape(8.dp))
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = if (isHindi) "✓ प्रमाणित लैब (Est. 2016)" else "✓ Flagship Lab (Est. 2016)",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CyanAccent,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }

                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Image(
                                painter = painterResource(id = R.drawable.super_telecom_logo),
                                contentDescription = "Super Telecom Brand",
                                modifier = Modifier
                                    .height(34.dp)
                                    .clip(RoundedCornerShape(6.dp))
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = "SUPER TELECOM GIRIDIH",
                                    style = MaterialTheme.typography.titleMedium.copy(
                                        fontWeight = FontWeight.Black,
                                        color = TextPrimary,
                                        letterSpacing = 0.5.sp
                                    )
                                )
                                Text(
                                    text = if (isHindi) "बरगंडा रोड, गिरिडीह • चिप-लेवल रिपेयर लैब" else "Barganda Road, Giridih • Chip-Level Repair Lab",
                                    style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 10.sp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = if (isHindi)
                                "परामर्श सेवा: निःशुल्क डायग्नोस्टिक निरीक्षण। चिप-लेवल सोल्डरिंग, स्क्रीन रिप्लेसमेंट और वाटर डैमेज रिकवरी।"
                            else
                                "Consultation Service: Free inspection at lab. 45x trinocular soldering, curved AMOLED replacement & data recovery.",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextMuted, fontSize = 11.sp)
                        )

                        Spacer(modifier = Modifier.height(10.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            Button(
                                onClick = {
                                    val url = "https://wa.me/918002903643?text=" + Uri.encode("Hello Super Telecom, I need consultation for my device.")
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    }
                                    try { context.startActivity(intent) } catch (_: Exception) {}
                                },
                                modifier = Modifier.weight(1f).height(44.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                            ) {
                                Icon(Icons.Default.Chat, contentDescription = null, modifier = Modifier.size(15.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isHindi) "वॉट्सऐप" else "WHATSAPP",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            }

                            Button(
                                onClick = {
                                    val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:+918002903643")).apply {
                                        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                                    }
                                    try { context.startActivity(intent) } catch (_: Exception) {}
                                },
                                modifier = Modifier.weight(1f).height(44.dp),
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark)
                            ) {
                                Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(15.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = if (isHindi) "कॉल करें" else "CALL NOW",
                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                )
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ── RECENT COMPLETED TASKS ──
            Text(
                text = if (isHindi) "हाल के पूरे किए गए कार्य" else "Recent Completed Tasks",
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
            )

            Spacer(modifier = Modifier.height(8.dp))

            if (recentTasks.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(CardDark.copy(alpha = 0.5f))
                        .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                        .padding(20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.TaskAlt,
                            contentDescription = null,
                            tint = TextMuted,
                            modifier = Modifier.size(30.dp)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (isHindi) "कोई हालिया कार्य रिकॉर्ड नहीं है" else "No Recent Tasks Yet",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = TextSecondary)
                        )
                        Text(
                            text = if (isHindi) "फ़ाइल ट्रांसफर या रिकवरी शुरू करने पर यहां इतिहास दर्ज होगा।" else "Completed transfers or restored files will appear here automatically.",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                    }
                }
            }
        }

        items(recentTasks) { task ->
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                when (task.type) {
                                    TaskType.TRANSFER_SENT -> CyanAccent.copy(alpha = 0.15f)
                                    TaskType.TRANSFER_RECEIVED -> EmeraldAccent.copy(alpha = 0.15f)
                                    TaskType.RECOVERED_MEDIA -> AmberAccent.copy(alpha = 0.15f)
                                }
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when (task.type) {
                                TaskType.TRANSFER_SENT -> Icons.Default.ArrowUpward
                                TaskType.TRANSFER_RECEIVED -> Icons.Default.ArrowDownward
                                TaskType.RECOVERED_MEDIA -> Icons.Default.CheckCircle
                            },
                            contentDescription = null,
                            tint = when (task.type) {
                                TaskType.TRANSFER_SENT -> CyanAccent
                                TaskType.TRANSFER_RECEIVED -> EmeraldAccent
                                TaskType.RECOVERED_MEDIA -> AmberAccent
                            },
                            modifier = Modifier.size(20.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(10.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = task.title,
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold
                            ),
                            maxLines = 1
                        )
                        Text(
                            text = "${task.subtitle} • ${(task.sizeBytes / 1_000_000.0).format(1)} MB",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        Text(
                            text = task.statusText,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = EmeraldAccent,
                                fontSize = 10.sp
                            )
                        )
                        Text(
                            text = task.timeAgo,
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = TextMuted,
                                fontSize = 10.sp
                            )
                        )
                    }
                }
            }
        }
    }

    // Store & Contact Dialog
    if (showStoreDialog) {
        AlertDialog(
            onDismissRequest = { showStoreDialog = false },
            title = {
                Text(
                    text = if (isHindi) "सुपर टेलीकॉम (गिरिडीह)" else "Super Telecom Giridih",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "स्थान: बरगंडा रोड (शिवम क्लिनिक के पास), गिरिडीह, झारखंड 815301\nकॉल / वॉट्सऐप: +91 80029 03643\nसमय: सुबह 10:00 से रात 9:30 बजे (सातों दिन)\n\nविशेषज्ञता: 45x माइक्रोस्कोप मदरबोर्ड BGA सोल्डरिंग, कर्व्ड AMOLED ग्लास रिप्लेसमेंट, CPU रीबॉलिंग और वाटर डैमेज रिवाइवल।"
                        else
                            "Address: Barganda Road, Near Shivam Clinic, Giridih, Jharkhand 815301\nCall/WhatsApp: +91 80029 03643\nHours: 10:00 AM – 9:30 PM (7 Days a week)\n\nSpecialist in 45x Trinocular Motherboard Soldering, Curved AMOLED Glass Separation, and Water Damage Revival.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { showStoreDialog = false }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun ScanShortcutButton(
    label: String,
    icon: ImageVector,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.height(48.dp),
        shape = RoundedCornerShape(10.dp),
        contentPadding = PaddingValues(horizontal = 4.dp, vertical = 6.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Black.copy(alpha = 0.35f),
            contentColor = Color.White
        )
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(16.dp))
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = label, style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, fontWeight = FontWeight.Bold))
        }
    }
}

@Composable
private fun QuickUtilityCard(
    title: String,
    desc: String,
    icon: ImageVector,
    accentColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(14.dp))
            .background(CardDark)
            .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
            .clickable(onClick = onClick)
            .padding(12.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .background(accentColor.copy(alpha = 0.15f), RoundedCornerShape(10.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = null, tint = accentColor, modifier = Modifier.size(18.dp))
            }
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleSmall.copy(
                        fontWeight = FontWeight.Bold,
                        color = TextPrimary,
                        fontSize = 12.sp
                    )
                )
                Text(
                    text = desc,
                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 10.sp)
                )
            }
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)

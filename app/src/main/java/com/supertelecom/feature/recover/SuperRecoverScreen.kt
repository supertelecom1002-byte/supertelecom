package com.supertelecom.feature.recover

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.RecoverItem
import com.supertelecom.model.RecoverTier
import com.supertelecom.model.StorageStats
import com.supertelecom.theme.*
import kotlinx.coroutines.launch
import java.util.Locale

enum class RecoverScreenMode {
    DASHBOARD,
    SCANNING,
    GALLERY,
    VAULT
}

@Composable
fun SuperRecoverScreen(
    isHindi: Boolean,
    initialCategory: RecoverCategory? = null,
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val recoverEngine = remember { StorageRecoverEngine(context) }

    var screenMode by remember { mutableStateOf(RecoverScreenMode.DASHBOARD) }
    var activeCategory by remember(initialCategory) { mutableStateOf(initialCategory ?: RecoverCategory.PHOTOS) }
    var activeFilterTag by remember { mutableStateOf("DELETED_CACHE") }

    var storageStats by remember { mutableStateOf(recoverEngine.getDeviceStorageStats()) }
    val isScanningEngine by recoverEngine.isScanning.collectAsState()
    val currentScanPath by recoverEngine.currentScanPath.collectAsState()
    val scannedCount by recoverEngine.scannedCount.collectAsState()
    val scanProgress by recoverEngine.scanProgress.collectAsState()

    val discoveredItems = remember { mutableStateListOf<RecoverItem>() }
    val vaultItems = remember { mutableStateListOf<RecoverItem>() }

    var previewItem by remember { mutableStateOf<RecoverItem?>(null) }
    var restoreResult by remember { mutableStateOf<Triple<Int, Int, String>?>(null) }
    var isRestoring by remember { mutableStateOf(false) }

    // Refresh storage stats on launch
    LaunchedEffect(Unit) {
        storageStats = recoverEngine.getDeviceStorageStats()
    }

    // Permission Launcher
    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions()
    ) { _ ->
        // Start scanning regardless of partial/full permissions
        coroutineScope.launch {
            screenMode = RecoverScreenMode.SCANNING
            val results = recoverEngine.executeDeepScan(activeCategory)
            discoveredItems.clear()
            discoveredItems.addAll(results)
            screenMode = RecoverScreenMode.GALLERY
        }
    }

    // Storage Access Framework (SAF) Folder Picker
    val safFolderPicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocumentTree()
    ) { treeUri: Uri? ->
        if (treeUri != null) {
            coroutineScope.launch {
                screenMode = RecoverScreenMode.SCANNING
                val results = recoverEngine.scanStorageAccessTree(treeUri, activeCategory)
                discoveredItems.clear()
                discoveredItems.addAll(results)
                screenMode = RecoverScreenMode.GALLERY
            }
        }
    }

    fun startCategoryScan(cat: RecoverCategory) {
        activeCategory = cat
        if (cat == RecoverCategory.VAULT) {
            coroutineScope.launch {
                vaultItems.clear()
                vaultItems.addAll(recoverEngine.scanRecoveredVault())
                screenMode = RecoverScreenMode.VAULT
            }
            return
        }

        // Check required permissions
        val neededPermissions = mutableListOf<String>()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            when (cat) {
                RecoverCategory.PHOTOS -> neededPermissions.add(Manifest.permission.READ_MEDIA_IMAGES)
                RecoverCategory.VIDEOS -> neededPermissions.add(Manifest.permission.READ_MEDIA_VIDEO)
                RecoverCategory.AUDIO_RECORDINGS -> neededPermissions.add(Manifest.permission.READ_MEDIA_AUDIO)
                else -> {
                    neededPermissions.add(Manifest.permission.READ_MEDIA_IMAGES)
                    neededPermissions.add(Manifest.permission.READ_MEDIA_VIDEO)
                    neededPermissions.add(Manifest.permission.READ_MEDIA_AUDIO)
                }
            }
        } else {
            neededPermissions.add(Manifest.permission.READ_EXTERNAL_STORAGE)
        }

        val hasAll = neededPermissions.all {
            ContextCompat.checkSelfPermission(context, it) == PackageManager.PERMISSION_GRANTED
        }

        if (hasAll) {
            coroutineScope.launch {
                screenMode = RecoverScreenMode.SCANNING
                val results = recoverEngine.executeDeepScan(cat)
                discoveredItems.clear()
                discoveredItems.addAll(results)
                screenMode = RecoverScreenMode.GALLERY
            }
        } else {
            permissionLauncher.launch(neededPermissions.toTypedArray())
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        when (screenMode) {
            RecoverScreenMode.DASHBOARD -> {
                RecoverDashboardView(
                    isHindi = isHindi,
                    stats = storageStats,
                    onSelectCategory = { cat -> startCategoryScan(cat) },
                    onOpenSaf = { safFolderPicker.launch(null) },
                    contentPadding = contentPadding
                )
            }

            RecoverScreenMode.SCANNING -> {
                RadarScanningScreen(
                    isHindi = isHindi,
                    category = activeCategory,
                    progress = scanProgress,
                    currentPath = currentScanPath,
                    foundCount = scannedCount,
                    onStopScan = {
                        recoverEngine.stopScan()
                        screenMode = RecoverScreenMode.GALLERY
                    }
                )
            }

            RecoverScreenMode.GALLERY -> {
                RecoverGalleryGridView(
                    isHindi = isHindi,
                    category = activeCategory,
                    items = discoveredItems,
                    activeFilterTag = activeFilterTag,
                    onFilterTagSelected = { activeFilterTag = it },
                    onOpenSaf = { safFolderPicker.launch(null) },
                    onToggleSelect = { item ->
                        val idx = discoveredItems.indexOfFirst { it.id == item.id }
                        if (idx != -1) {
                            discoveredItems[idx] = discoveredItems[idx].copy(isSelected = !discoveredItems[idx].isSelected)
                        }
                    },
                    onToggleSelectAll = { selectAll ->
                        for (i in 0 until discoveredItems.size) {
                            discoveredItems[i] = discoveredItems[i].copy(isSelected = selectAll)
                        }
                    },
                    onPreviewItem = { previewItem = it },
                    onBackToDashboard = { screenMode = RecoverScreenMode.DASHBOARD },
                    onRestoreSelected = {
                        val selectedList = discoveredItems.filter { it.isSelected }
                        if (selectedList.isNotEmpty() && !isRestoring) {
                            isRestoring = true
                            coroutineScope.launch {
                                val res = recoverEngine.restoreSelectedItems(selectedList)
                                isRestoring = false
                                restoreResult = res
                            }
                        }
                    },
                    contentPadding = contentPadding
                )
            }

            RecoverScreenMode.VAULT -> {
                RecoveredVaultView(
                    isHindi = isHindi,
                    items = vaultItems,
                    onBackToDashboard = { screenMode = RecoverScreenMode.DASHBOARD },
                    onPreviewItem = { previewItem = it },
                    contentPadding = contentPadding
                )
            }
        }

        // Full Screen Preview Dialog
        previewItem?.let { item ->
            FullScreenMediaPreviewDialog(
                context = context,
                item = item,
                isHindi = isHindi,
                onDismiss = { previewItem = null },
                onRecoverSingle = {
                    coroutineScope.launch {
                        val res = recoverEngine.restoreSelectedItems(listOf(item))
                        previewItem = null
                        restoreResult = res
                    }
                }
            )
        }

        // Restore Result Success Dialog
        restoreResult?.let { (success, failed, path) ->
            AlertDialog(
                onDismissRequest = { restoreResult = null },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = if (success > 0) Icons.Default.CheckCircle else Icons.Default.Error,
                            contentDescription = null,
                            tint = if (success > 0) EmeraldAccent else RoseAccent,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = if (isHindi) "🎉 रिकवरी सफल!" else "🎉 Recovery Completed!",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black)
                        )
                    }
                },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(
                            text = if (isHindi)
                                "$success फाइलें बिना किसी ओवरराइट के सुरक्षित रूप से फोन गैलरी में रीस्टोर कर दी गई हैं।"
                            else
                                "$success file(s) safely restored to phone gallery without overwriting existing data.",
                            style = MaterialTheme.typography.bodyMedium
                        )
                        if (failed > 0) {
                            Text(
                                text = if (isHindi)
                                    "$failed फाइलें स्रोत उपलब्ध न होने के कारण नहीं पढ़ी जा सकीं।"
                                else
                                    "$failed file(s) could not be retrieved from source.",
                                style = MaterialTheme.typography.bodySmall.copy(color = RoseAccent)
                            )
                        }
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(CardDark)
                                .padding(8.dp)
                        ) {
                            Text(
                                text = "Saved: $path",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    fontFamily = FontFamily.Monospace,
                                    color = CyanAccent,
                                    fontSize = 10.sp
                                )
                            )
                        }
                    }
                },
                confirmButton = {
                    Button(
                        onClick = {
                            restoreResult = null
                            startCategoryScan(RecoverCategory.VAULT)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(text = if (isHindi) "वॉल्ट देखें (Open Vault)" else "Open Vault", fontWeight = FontWeight.Bold)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { restoreResult = null }) {
                        Text(text = if (isHindi) "बंद करें" else "Close", color = TextSecondary)
                    }
                },
                containerColor = Color(0xFF0F172A),
                shape = RoundedCornerShape(16.dp)
            )
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ALL-RECOVERY STYLE DASHBOARD VIEW
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun RecoverDashboardView(
    isHindi: Boolean,
    stats: StorageStats,
    onSelectCategory: (RecoverCategory) -> Unit,
    onOpenSaf: () -> Unit,
    contentPadding: PaddingValues
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .padding(
                start = 16.dp,
                end = 16.dp,
                top = 10.dp,
                bottom = contentPadding.calculateBottomPadding()
            )
    ) {
        // Top App Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = if (isHindi) "सुपर रिकवर (Super Recover)" else "Super Recover",
                    style = MaterialTheme.typography.titleLarge.copy(
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        fontSize = 20.sp
                    )
                )
                Text(
                    text = if (isHindi) "ऑल-रिकवरी विज़ुअल मीडिया व फाइल स्कैनर" else "All-Recovery Visual On-Device Scanner",
                    style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary)
                )
            }

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(10.dp))
                    .background(EmeraldAccent.copy(alpha = 0.15f))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.35f), RoundedCornerShape(10.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(
                    text = if (isHindi) "100% फ्री व सुरक्षित" else "100% Free & Safe",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = EmeraldAccent,
                        fontWeight = FontWeight.Bold,
                        fontSize = 10.sp
                    )
                )
            }
        }

        Spacer(modifier = Modifier.height(14.dp))

        // ── STORAGE STATUS METER BANNER ──
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .background(
                    Brush.linearGradient(
                        listOf(Color(0xFF0F172A), Color(0xFF1E293B), Color(0xFF0B192C))
                    )
                )
                .border(1.dp, CyanAccent.copy(alpha = 0.35f), RoundedCornerShape(18.dp))
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
                                .size(34.dp)
                                .background(CyanAccent.copy(alpha = 0.2f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Storage,
                                contentDescription = null,
                                tint = CyanAccent,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = if (isHindi) "डिवाइस स्टोरेज स्थिति" else "Device Storage Status",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                            )
                            Text(
                                text = "Used ${stats.usedGbFormatted} / ${stats.totalGbFormatted}",
                                style = MaterialTheme.typography.labelSmall.copy(
                                    color = CyanAccent,
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                    }

                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(EmeraldAccent.copy(alpha = 0.2f))
                            .padding(horizontal = 8.dp, vertical = 3.dp)
                    ) {
                        Text(
                            text = "${stats.freeGbFormatted} Free",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = EmeraldAccent,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Progress Bar
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color(0xFF334155))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(stats.usedPercent)
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(4.dp))
                            .background(
                                Brush.horizontalGradient(
                                    listOf(EmeraldAccent, CyanAccent, Color(0xFF38BDF8))
                                )
                            )
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = if (isHindi) "रिकवरी श्रेणी चुनें (Select Recovery Category)" else "Select Recovery Category",
            style = MaterialTheme.typography.titleMedium.copy(
                fontWeight = FontWeight.Bold,
                color = Color.White,
                fontSize = 14.sp
            )
        )

        Spacer(modifier = Modifier.height(10.dp))

        // ── 2x2 BIG COLORFUL RECOVERY CATEGORY CARDS ──
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            VisualCategoryCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "फ़ोटो रिकवरी" else "Photo Recovery",
                subtitle = "JPG, PNG, WEBP, HEIC",
                icon = Icons.Default.PhotoLibrary,
                gradient = listOf(Color(0xFF1E3A8A), Color(0xFF0284C7)),
                iconTint = Color(0xFF38BDF8),
                badgeText = "DEEP SCAN",
                onClick = { onSelectCategory(RecoverCategory.PHOTOS) }
            )

            VisualCategoryCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "वीडियो रिकवरी" else "Video Recovery",
                subtitle = "MP4, MKV, MOV, WA",
                icon = Icons.Default.VideoLibrary,
                gradient = listOf(Color(0xFF581C87), Color(0xFF9333EA)),
                iconTint = Color(0xFFC084FC),
                badgeText = "HD VIDEO",
                onClick = { onSelectCategory(RecoverCategory.VIDEOS) }
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            VisualCategoryCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "ऑडियो व कॉल" else "Audio & Calls",
                subtitle = "MP3, M4A, WAV, AMR",
                icon = Icons.Default.Mic,
                gradient = listOf(Color(0xFF7C2D12), Color(0xFFEA580C)),
                iconTint = Color(0xFFFB923C),
                badgeText = "VOICE",
                onClick = { onSelectCategory(RecoverCategory.AUDIO_RECORDINGS) }
            )

            VisualCategoryCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "डॉक्यूमेंट फाइलें" else "Documents",
                subtitle = "PDF, DOCX, ZIP, APK",
                icon = Icons.Default.Description,
                gradient = listOf(Color(0xFF064E3B), Color(0xFF059669)),
                iconTint = Color(0xFF34D399),
                badgeText = "FILES",
                onClick = { onSelectCategory(RecoverCategory.DOCUMENTS) }
            )
        }

        Spacer(modifier = Modifier.height(14.dp))

        // ── 2 QUICK ACCESS CARDS: TRASH & RECOVERED VAULT ──
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            QuickAccessCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "रीसायकल बिन" else "Recycle Bin",
                subtitle = if (isHindi) "सिस्टम ट्रैश मीडिया" else "System Trashed Media",
                icon = Icons.Default.DeleteSweep,
                borderColor = Color(0xFFE11D48),
                iconColor = Color(0xFFFB7185),
                onClick = { onSelectCategory(RecoverCategory.TRASH) }
            )

            QuickAccessCard(
                modifier = Modifier.weight(1f),
                title = if (isHindi) "रिकवर की गई फाइलें" else "Recovered Vault",
                subtitle = if (isHindi) "सहेजी गई फाइलों का वॉल्ट" else "Restored Media Gallery",
                icon = Icons.Default.FolderSpecial,
                borderColor = EmeraldAccent,
                iconColor = EmeraldAccent,
                onClick = { onSelectCategory(RecoverCategory.VAULT) }
            )
        }

        Spacer(modifier = Modifier.height(10.dp))

        // SAF Folder / SD Card Button
        OutlinedButton(
            onClick = onOpenSaf,
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
            border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
        ) {
            Icon(
                imageVector = Icons.Default.FolderOpen,
                contentDescription = null,
                tint = CyanAccent,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = if (isHindi) "कस्टम फ़ोल्डर या SD कार्ड स्कैन करें (SAF)" else "Custom Folder or SD Card Deep Scan (SAF)",
                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = TextPrimary)
            )
        }
    }
}

@Composable
private fun VisualCategoryCard(
    modifier: Modifier = Modifier,
    title: String,
    subtitle: String,
    icon: ImageVector,
    gradient: List<Color>,
    iconTint: Color,
    badgeText: String,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(125.dp)
            .clip(RoundedCornerShape(20.dp))
            .background(Brush.linearGradient(gradient))
            .border(1.dp, iconTint.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(12.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(38.dp)
                        .background(Color.Black.copy(alpha = 0.3f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = iconTint,
                        modifier = Modifier.size(22.dp)
                    )
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(Color.Black.copy(alpha = 0.35f))
                        .padding(horizontal = 6.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = badgeText,
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = iconTint,
                            fontWeight = FontWeight.Black,
                            fontSize = 8.sp,
                            fontFamily = FontFamily.Monospace
                        )
                    )
                }
            }

            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = Color.White,
                        fontSize = 14.sp
                    )
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = Color.White.copy(alpha = 0.75f),
                        fontSize = 10.sp
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
private fun QuickAccessCard(
    modifier: Modifier = Modifier,
    title: String,
    subtitle: String,
    icon: ImageVector,
    borderColor: Color,
    iconColor: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(72.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(CardDark)
            .border(1.dp, borderColor.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxSize(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(34.dp)
                    .background(iconColor.copy(alpha = 0.15f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconColor,
                    modifier = Modifier.size(18.dp)
                )
            }

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = title,
                    style = MaterialTheme.typography.labelMedium.copy(
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = subtitle,
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextSecondary,
                        fontSize = 9.sp
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. LIVE RADAR SCANNING ANIMATION VIEW
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun RadarScanningScreen(
    isHindi: Boolean,
    category: RecoverCategory,
    progress: Float,
    currentPath: String,
    foundCount: Int,
    onStopScan: () -> Unit
) {
    val infiniteTransition = rememberInfiniteTransition(label = "radar")
    val rotation by infiniteTransition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "rotation"
    )

    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 0.8f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(1400, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    val categoryColor = when (category) {
        RecoverCategory.PHOTOS -> Color(0xFF0284C7)
        RecoverCategory.VIDEOS -> Color(0xFF9333EA)
        RecoverCategory.AUDIO_RECORDINGS -> Color(0xFFEA580C)
        RecoverCategory.DOCUMENTS -> Color(0xFF059669)
        else -> CyanAccent
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding()
            .padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Radar Animation Circle
            Box(
                modifier = Modifier
                    .size(240.dp)
                    .clip(CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val center = Offset(size.width / 2, size.height / 2)
                    val radius = size.width / 2

                    // Concentric rings
                    drawCircle(color = categoryColor.copy(alpha = 0.15f), radius = radius, center = center)
                    drawCircle(color = categoryColor.copy(alpha = 0.25f), radius = radius * 0.7f, center = center)
                    drawCircle(color = categoryColor.copy(alpha = 0.35f), radius = radius * 0.4f, center = center)

                    // Sweeping radar wedge
                    drawArc(
                        brush = Brush.sweepGradient(
                            listOf(
                                Color.Transparent,
                                categoryColor.copy(alpha = 0.05f),
                                categoryColor.copy(alpha = 0.55f)
                            ),
                            center = center
                        ),
                        startAngle = rotation,
                        sweepAngle = 90f,
                        useCenter = true
                    )
                }

                // Center Icon with Pulse
                Box(
                    modifier = Modifier
                        .size((56 * pulseScale).dp)
                        .background(categoryColor.copy(alpha = 0.25f), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = when (category) {
                            RecoverCategory.PHOTOS -> Icons.Default.PhotoLibrary
                            RecoverCategory.VIDEOS -> Icons.Default.VideoLibrary
                            RecoverCategory.AUDIO_RECORDINGS -> Icons.Default.Mic
                            RecoverCategory.DOCUMENTS -> Icons.Default.Description
                            else -> Icons.Default.Search
                        },
                        contentDescription = null,
                        tint = categoryColor,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Percentage Counter
            val percentInt = (progress * 100).toInt().coerceIn(0, 100)
            Text(
                text = "$percentInt%",
                style = MaterialTheme.typography.displaySmall.copy(
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
            )

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = if (isHindi)
                    "कृपया प्रतीक्षा करें... फोन स्टोरेज, थंबनेल कैश व हिडन फोल्डर्स स्कैन हो रहे हैं"
                else
                    "Please wait... Scanning phone memory, thumbnail cache & hidden directories",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Live Path Display
            Text(
                text = currentPath,
                style = MaterialTheme.typography.labelSmall.copy(
                    fontFamily = FontFamily.Monospace,
                    color = TextSecondary,
                    fontSize = 11.sp,
                    textAlign = TextAlign.Center
                ),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Live Counter Badge
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(EmeraldAccent.copy(alpha = 0.15f))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.4f), RoundedCornerShape(12.dp))
                    .padding(horizontal = 14.dp, vertical = 6.dp)
            ) {
                Text(
                    text = if (isHindi)
                        "⚡ मिली हुई फाइलें: $foundCount"
                    else
                        "⚡ Files Found: $foundCount",
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = EmeraldAccent,
                        fontWeight = FontWeight.Black
                    )
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Stop Scan Button
            Button(
                onClick = onStopScan,
                colors = ButtonDefaults.buttonColors(
                    containerColor = RoseAccent.copy(alpha = 0.2f),
                    contentColor = RoseAccent
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, RoseAccent.copy(alpha = 0.5f)),
                shape = RoundedCornerShape(12.dp),
                modifier = Modifier.height(48.dp)
            ) {
                Icon(imageVector = Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = if (isHindi) "स्कैन रोकें व परिणाम देखें" else "Stop Scan & View Results",
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. 3-COLUMN VISUAL GALLERY GRID VIEW
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun RecoverGalleryGridView(
    isHindi: Boolean,
    category: RecoverCategory,
    items: List<RecoverItem>,
    activeFilterTag: String,
    onFilterTagSelected: (String) -> Unit,
    onOpenSaf: () -> Unit = {},
    onToggleSelect: (RecoverItem) -> Unit,
    onToggleSelectAll: (Boolean) -> Unit,
    onPreviewItem: (RecoverItem) -> Unit,
    onBackToDashboard: () -> Unit,
    onRestoreSelected: () -> Unit,
    contentPadding: PaddingValues
) {
    val context = LocalContext.current

    val deletedCacheItems = remember(items.size) {
        items.filter {
            it.tier == RecoverTier.SYSTEM_TRASH ||
            it.tier == RecoverTier.THUMBNAIL_PREVIEW ||
            it.id.startsWith("carved_") ||
            it.id.startsWith("trash_") ||
            it.id.startsWith("orphan_") ||
            it.id.startsWith("thumb_") ||
            it.sourcePath.contains("thumb", ignoreCase = true) ||
            it.sourcePath.contains("trash", ignoreCase = true)
        }
    }
    val socialItems = remember(items.size) {
        items.filter {
            it.sourcePath.contains("WhatsApp", ignoreCase = true) ||
            it.sourcePath.contains("Telegram", ignoreCase = true) ||
            it.sourcePath.contains("Social", ignoreCase = true)
        }
    }
    val safItems = remember(items.size) {
        items.filter {
            it.sourcePath.contains("SAF", ignoreCase = true) ||
            it.sourcePath.contains("Hidden", ignoreCase = true) ||
            it.sourcePath.contains(".nomedia", ignoreCase = true)
        }
    }

    // Filter items based on active chip - STRICT: No fake gallery fallback!
    val filteredList = remember(items.size, activeFilterTag) {
        when (activeFilterTag) {
            "DELETED_CACHE" -> deletedCacheItems
            "WHATSAPP_SOCIAL" -> socialItems
            "SAF_SCAN" -> safItems
            else -> items
        }
    }

    val selectedCount = items.count { it.isSelected }
    val totalBytes = items.filter { it.isSelected }.sumOf { it.sizeBytes }
    val allSelected = items.isNotEmpty() && items.all { it.isSelected }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
        ) {
            // Top Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(onClick = onBackToDashboard) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                    Spacer(modifier = Modifier.width(4.dp))
                    Column {
                        Text(
                            text = if (isHindi) "${category.labelHi} (${filteredList.size})" else "${category.labelEn} (${filteredList.size})",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = Color.White
                            )
                        )
                        Text(
                            text = if (isHindi) "3-कॉलम विज़ुअल ग्रिड" else "Visual 3-Column Grid",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 10.sp)
                        )
                    }
                }

                // Select All Toggle
                TextButton(
                    onClick = { onToggleSelectAll(!allSelected) },
                    colors = ButtonDefaults.textButtonColors(contentColor = CyanAccent)
                ) {
                    Text(
                        text = if (allSelected) (if (isHindi) "सब हटाएं" else "Deselect All") else (if (isHindi) "सभी चुनें" else "Select All"),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                }
            }

            // Top Filter Chips (4 All-Recovery Master Tabs)
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 14.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterTabChip(
                    label = if (isHindi) "🗑️ डिलीट व कैश (${deletedCacheItems.size})" else "🗑️ Deleted & Cache (${deletedCacheItems.size})",
                    isSelected = activeFilterTag == "DELETED_CACHE",
                    onClick = { onFilterTagSelected("DELETED_CACHE") }
                )
                FilterTabChip(
                    label = if (isHindi) "💬 WhatsApp व सोशल (${socialItems.size})" else "💬 WhatsApp & Social (${socialItems.size})",
                    isSelected = activeFilterTag == "WHATSAPP_SOCIAL",
                    onClick = { onFilterTagSelected("WHATSAPP_SOCIAL") }
                )
                FilterTabChip(
                    label = if (isHindi) "📂 डीप फोल्डर स्कैन (${safItems.size})" else "📂 Deep Folder (${safItems.size})",
                    isSelected = activeFilterTag == "SAF_SCAN",
                    onClick = {
                        onFilterTagSelected("SAF_SCAN")
                        if (safItems.isEmpty()) {
                            onOpenSaf()
                        }
                    }
                )
                FilterTabChip(
                    label = if (isHindi) "🖼️ सभी फाइलें (${items.size})" else "🖼️ All Found (${items.size})",
                    isSelected = activeFilterTag == "ALL",
                    onClick = { onFilterTagSelected("ALL") }
                )
            }

            Spacer(modifier = Modifier.height(6.dp))

            // ── 3-COLUMN VISUAL LAZY VERTICAL GRID ──
            if (filteredList.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(Color(0xFF0F172A))
                            .border(1.dp, CardBorder, RoundedCornerShape(20.dp))
                            .padding(22.dp)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .background(CyanAccent.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.FolderOpen,
                                contentDescription = null,
                                tint = CyanAccent,
                                modifier = Modifier.size(30.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(14.dp))
                        Text(
                            text = if (isHindi) "क्विक स्कैन में कोई डिलीटेड फाइल नहीं मिली" else "No Deleted Files in Quick Scan",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            ),
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (isHindi)
                                "रीसायकल बिन या क्विक कैशे खाली है।\nपूरे फोन के छिपे .thumbnails, WhatsApp .Statuses और SD कार्ड को गहराई से स्कैन करने के लिए नीचे टैप करें:"
                            else
                                "Recycle bin and quick cache are empty.\nTo scan all hidden .thumbnails, WhatsApp .Statuses and full storage folders, tap below:",
                            style = MaterialTheme.typography.bodySmall.copy(
                                color = TextSecondary,
                                fontSize = 12.sp
                            ),
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = onOpenSaf,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(46.dp),
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = CyanAccent,
                                contentColor = BgDark
                            )
                        ) {
                            Icon(Icons.Default.Search, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = if (isHindi) "पूरा स्टोरेज डीप स्कैन करें (SAF)" else "DEEP SCAN FULL STORAGE (SAF)",
                                style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                            )
                        }
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(3),
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 8.dp),
                    contentPadding = PaddingValues(
                        bottom = contentPadding.calculateBottomPadding() + 90.dp
                    ),
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    items(filteredList, key = { it.id }) { item ->
                        VisualThumbnailGridCard(
                            context = context,
                            item = item,
                            onToggleSelect = { onToggleSelect(item) },
                            onPreview = { onPreviewItem(item) }
                        )
                    }
                }
            }
        }

        // ── STICKY BOTTOM RECOVER ACTION BAR ──
        if (selectedCount > 0) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(bottom = contentPadding.calculateBottomPadding())
                    .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .background(Color(0xFF0F172A))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.5f), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "$selectedCount फाइलें चुनी गईं" else "$selectedCount Files Selected",
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = EmeraldAccent
                            )
                        )
                        Text(
                            text = "Size: %.1f MB".format(Locale.US, totalBytes / 1_000_000f),
                            style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }

                    Button(
                        onClick = onRestoreSelected,
                        modifier = Modifier
                            .height(50.dp)
                            .defaultMinSize(minWidth = 190.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EmeraldAccent,
                            contentColor = BgDark
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.SettingsBackupRestore,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isHindi) "अभी रिकवर करें ($selectedCount)" else "RECOVER NOW ($selectedCount)",
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun FilterTabChip(
    label: String,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(10.dp))
            .background(if (isSelected) CyanAccent else CardDark)
            .border(1.dp, if (isSelected) CyanAccent else CardBorder, RoundedCornerShape(10.dp))
            .clickable { onClick() }
            .padding(horizontal = 10.dp, vertical = 5.dp)
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                color = if (isSelected) BgDark else TextSecondary,
                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                fontSize = 10.sp
            )
        )
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL BITMAP THUMBNAIL CARD
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun VisualThumbnailGridCard(
    context: Context,
    item: RecoverItem,
    onToggleSelect: () -> Unit,
    onPreview: () -> Unit
) {
    // Asynchronously load real bitmap thumbnail safely with produceState
    val thumbnailBitmap by produceState<Bitmap?>(initialValue = null, key1 = item.id) {
        value = ThumbnailLoader.loadThumbnail(context, item, 300, 300)
    }

    val sizeFormatted = when {
        item.sizeBytes >= 1_000_000L -> "%.1f MB".format(Locale.US, item.sizeBytes / 1_000_000f)
        item.sizeBytes > 0 -> "${item.sizeBytes / 1024} KB"
        else -> "0 B"
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .clip(RoundedCornerShape(10.dp))
            .background(CardDark)
            .border(
                width = if (item.isSelected) 2.dp else 1.dp,
                color = if (item.isSelected) EmeraldAccent else CardBorder,
                shape = RoundedCornerShape(10.dp)
            )
            .clickable { onPreview() }
    ) {
        if (thumbnailBitmap != null) {
            Image(
                bitmap = thumbnailBitmap!!.asImageBitmap(),
                contentDescription = item.name,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        } else {
            // Icon Placeholder for Audio / Docs / Loading state
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFF1E293B)),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = when (item.category) {
                        RecoverCategory.PHOTOS -> Icons.Default.Image
                        RecoverCategory.VIDEOS -> Icons.Default.Videocam
                        RecoverCategory.AUDIO_RECORDINGS -> Icons.Default.Audiotrack
                        RecoverCategory.DOCUMENTS -> Icons.Default.Description
                        else -> Icons.Default.InsertDriveFile
                    },
                    contentDescription = null,
                    tint = TextMuted,
                    modifier = Modifier.size(32.dp)
                )
            }
        }

        // Top Right Round Checkbox
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(4.dp)
                .size(24.dp)
                .clip(CircleShape)
                .background(if (item.isSelected) EmeraldAccent else Color.Black.copy(alpha = 0.5f))
                .clickable { onToggleSelect() },
            contentAlignment = Alignment.Center
        ) {
            if (item.isSelected) {
                Icon(
                    imageVector = Icons.Default.Check,
                    contentDescription = "Selected",
                    tint = BgDark,
                    modifier = Modifier.size(16.dp)
                )
            }
        }

        // Top Left Source Tag (Trash / Thumbdata / WhatsApp / Hidden)
        val (badgeLabel, badgeColor) = when {
            item.tier == RecoverTier.SYSTEM_TRASH || item.sourcePath.contains("trash", ignoreCase = true) ->
                Pair("TRASH", Color(0xFFEF4444))
            item.id.startsWith("carved_") || item.sourcePath.contains("thumbdata", ignoreCase = true) ->
                Pair("THUMBDATA", Color(0xFF8B5CF6))
            item.sourcePath.contains("WhatsApp", ignoreCase = true) ->
                Pair("WHATSAPP", Color(0xFF10B981))
            item.tier == RecoverTier.HIDDEN_MEDIA || item.sourcePath.contains("hidden", ignoreCase = true) ->
                Pair("HIDDEN", Color(0xFFF59E0B))
            item.tier == RecoverTier.THUMBNAIL_PREVIEW ->
                Pair("THUMB", Color(0xFF0284C7))
            else -> Pair<String?, Color?>(null, null)
        }

        if (badgeLabel != null && badgeColor != null) {
            Box(
                modifier = Modifier
                    .align(Alignment.TopStart)
                    .padding(4.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(badgeColor.copy(alpha = 0.9f))
                    .padding(horizontal = 4.dp, vertical = 2.dp)
            ) {
                Text(
                    text = badgeLabel,
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = Color.White,
                        fontWeight = FontWeight.Black,
                        fontSize = 8.sp,
                        fontFamily = FontFamily.Monospace
                    )
                )
            }
        }

        // Bottom Gradient Overlay with File Size
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        listOf(Color.Transparent, Color.Black.copy(alpha = 0.85f))
                    )
                )
                .padding(horizontal = 6.dp, vertical = 4.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = sizeFormatted,
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                )

                if (item.category == RecoverCategory.VIDEOS) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = CyanAccent,
                        modifier = Modifier.size(14.dp)
                    )
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RECOVERED FILES VAULT VIEW
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun RecoveredVaultView(
    isHindi: Boolean,
    items: List<RecoverItem>,
    onBackToDashboard: () -> Unit,
    onPreviewItem: (RecoverItem) -> Unit,
    contentPadding: PaddingValues
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
    ) {
        // Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackToDashboard) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Spacer(modifier = Modifier.width(4.dp))
            Column {
                Text(
                    text = if (isHindi) "रिकवर की गई फाइलें (${items.size})" else "Recovered Vault (${items.size})",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Black,
                        color = EmeraldAccent
                    )
                )
                Text(
                    text = "Downloads/SuperTelecom_Recovered",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = TextSecondary,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace
                    )
                )
            }
        }

        if (items.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(32.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.FolderSpecial,
                        contentDescription = null,
                        tint = EmeraldAccent.copy(alpha = 0.4f),
                        modifier = Modifier.size(54.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = if (isHindi) "वॉल्ट अभी खाली है" else "Vault is currently empty",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, color = Color.White)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = if (isHindi) "किसी भी कैटेगरी से फाइलें रिकवर करें, वे यहाँ सुरक्षित रहेंगी।" else "Recover files from any category to preserve them here.",
                        style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, textAlign = TextAlign.Center)
                    )
                }
            }
        } else {
            LazyVerticalGrid(
                columns = GridCells.Fixed(3),
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 8.dp),
                contentPadding = PaddingValues(
                    bottom = contentPadding.calculateBottomPadding() + 20.dp
                ),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                items(items, key = { it.id }) { item ->
                    VisualThumbnailGridCard(
                        context = context,
                        item = item,
                        onToggleSelect = {},
                        onPreview = { onPreviewItem(item) }
                    )
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. FULL-SCREEN MEDIA PREVIEW DIALOG
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun FullScreenMediaPreviewDialog(
    context: Context,
    item: RecoverItem,
    isHindi: Boolean,
    onDismiss: () -> Unit,
    onRecoverSingle: () -> Unit
) {
    val fullBitmap by produceState<Bitmap?>(initialValue = null, key1 = item.id) {
        value = ThumbnailLoader.loadThumbnail(context, item, 800, 800)
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Text(
                text = item.name,
                style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                // Image Preview Box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(240.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF0F172A)),
                    contentAlignment = Alignment.Center
                ) {
                    if (fullBitmap != null) {
                        Image(
                            bitmap = fullBitmap!!.asImageBitmap(),
                            contentDescription = item.name,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Fit
                        )
                    } else {
                        Icon(
                            imageVector = when (item.category) {
                                RecoverCategory.PHOTOS -> Icons.Default.Image
                                RecoverCategory.VIDEOS -> Icons.Default.Videocam
                                RecoverCategory.AUDIO_RECORDINGS -> Icons.Default.Audiotrack
                                else -> Icons.Default.InsertDriveFile
                            },
                            contentDescription = null,
                            tint = CyanAccent,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }

                // File Details
                Text(
                    text = "Size: %.2f MB • ${item.dateModified}".format(Locale.US, item.sizeBytes / 1_000_000f),
                    style = MaterialTheme.typography.bodySmall.copy(fontWeight = FontWeight.Bold)
                )

                Text(
                    text = "Source: ${item.sourcePath}",
                    style = MaterialTheme.typography.labelSmall.copy(
                        fontFamily = FontFamily.Monospace,
                        color = TextSecondary,
                        fontSize = 10.sp
                    )
                )

                Text(
                    text = "Status: ${item.tier.titleEn}",
                    style = MaterialTheme.typography.labelSmall.copy(
                        color = EmeraldAccent,
                        fontWeight = FontWeight.Bold
                    )
                )
            }
        },
        confirmButton = {
            Button(
                onClick = onRecoverSingle,
                colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(imageVector = Icons.Default.SettingsBackupRestore, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = if (isHindi) "यह फाइल रीस्टोर करें" else "Recover This File", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = if (isHindi) "बंद करें" else "Close", color = TextSecondary)
            }
        },
        containerColor = Color(0xFF0F172A),
        shape = RoundedCornerShape(16.dp)
    )
}

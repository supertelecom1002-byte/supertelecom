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
import com.supertelecom.model.RecoverSettings
import com.supertelecom.model.RecoverTier
import com.supertelecom.model.StorageStats
import com.supertelecom.theme.*
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import android.content.Intent
import android.widget.Toast
import androidx.compose.ui.window.Dialog
import androidx.compose.foundation.BorderStroke

enum class TimeRangeFilter(val labelHi: String, val labelEn: String) {
    ALL("📅 सभी समय", "All Time"),
    POST_FORMAT("💾 फॉर्मेट रिकवरी (पुराना डेटा)", "Post-Format (Raw)"),
    ONE_YEAR("🕒 1 साल तक", "1 Year"),
    TWO_YEARS("⏳ 2 साल तक", "2 Years"),
    THREE_YEARS("⏳ 3 साल तक", "3 Years"),
    FOUR_YEARS("⏳ 4 साल तक", "4 Years"),
    FIVE_YEARS("⏳ 5 साल तक", "5 Years"),
    TEN_YEARS("🏛️ 10 साल तक", "10 Years"),
    TWENTY_YEARS("🏛️ 20 साल (आर्काइव)", "20 Years Archive"),
    CUSTOM("🗓️ तारीख चुनें...", "Custom Range...")
}

enum class SizeFilter(val labelHi: String, val labelEn: String, val minBytes: Long) {
    ALL("🔍 सभी साइज़", "All Sizes", 0L),
    CLEAN("✨ स्पष्ट (>50 KB)", "Clear (>50 KB)", 50 * 1024L),
    HD("💎 HD (>250 KB)", "HD (>250 KB)", 250 * 1024L),
    ORIGINAL("📸 ओरिजिनल (>1 MB)", "Original (>1 MB)", 1024 * 1024L)
}

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
    var activeFilterTag by remember { mutableStateOf("ALL") }
    var activeTimeFilter by remember { mutableStateOf(TimeRangeFilter.ALL) }
    var activeSizeFilter by remember { mutableStateOf(SizeFilter.ALL) }
    var customStartMillis by remember { mutableStateOf(0L) }
    var customEndMillis by remember { mutableStateOf(System.currentTimeMillis()) }
    var customRangeLabel by remember { mutableStateOf("") }
    var showCustomDateDialog by remember { mutableStateOf(false) }
    var showSettingsDialog by remember { mutableStateOf(false) }
    var recoverSettings by remember { mutableStateOf(RecoverSettings()) }

    var isOneClickRunning by remember { mutableStateOf(false) }
    var oneClickPhase by remember { mutableStateOf("") }
    var oneClickProgress by remember { mutableStateOf(0f) }
    var oneClickFoundCount by remember { mutableStateOf(0) }

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

    fun runOneClickAutoRecover() {
        if (!StorageRecoverEngine.hasStoragePermission(context)) {
            Toast.makeText(
                context,
                if (isHindi) "कृपया पहले पूर्ण स्टोरेज (All Files Access) की अनुमति दें" else "Please grant All Files Access to recover files",
                Toast.LENGTH_LONG
            ).show()
            StorageRecoverEngine.requestStoragePermission(context)
            return
        }

        isOneClickRunning = true
        oneClickProgress = 0.05f
        oneClickPhase = if (isHindi) "1-क्लिक डीप स्टोरेज स्कैन शुरू हो रहा है..." else "Initializing 1-Tap Deep Scan..."
        oneClickFoundCount = 0

        coroutineScope.launch {
            try {
                val result = recoverEngine.executeOneClickFullScanAndRecover { phase, progress, found ->
                    oneClickPhase = phase
                    oneClickProgress = progress
                    oneClickFoundCount = found
                }
                isOneClickRunning = false
                restoreResult = result
                vaultItems.clear()
                vaultItems.addAll(recoverEngine.scanRecoveredVault())
            } catch (e: Exception) {
                isOneClickRunning = false
                Toast.makeText(context, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

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
        activeFilterTag = "ALL"
        activeTimeFilter = TimeRangeFilter.ALL
        activeSizeFilter = SizeFilter.ALL
        customRangeLabel = ""
        if (cat == RecoverCategory.VAULT) {
            coroutineScope.launch {
                vaultItems.clear()
                vaultItems.addAll(recoverEngine.scanRecoveredVault())
                screenMode = RecoverScreenMode.VAULT
            }
            return
        }

        if (!StorageRecoverEngine.hasStoragePermission(context)) {
            Toast.makeText(
                context,
                if (isHindi) "डीप रिकवरी के लिए ऑल फाइल्स एक्सेस की अनुमति आवश्यक है" else "All Files Access is required for deep file recovery",
                Toast.LENGTH_SHORT
            ).show()
            StorageRecoverEngine.requestStoragePermission(context)
            return
        }

        coroutineScope.launch {
            screenMode = RecoverScreenMode.SCANNING
            val results = recoverEngine.executeDeepScan(cat)
            discoveredItems.clear()
            discoveredItems.addAll(results)
            screenMode = RecoverScreenMode.GALLERY
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
                    onOneClickAutoRecover = { runOneClickAutoRecover() },
                    onOpenSettings = { showSettingsDialog = true },
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
                    activeTimeFilter = activeTimeFilter,
                    onTimeFilterSelected = { filter ->
                        activeTimeFilter = filter
                        if (filter == TimeRangeFilter.CUSTOM) {
                            showCustomDateDialog = true
                        }
                    },
                    activeSizeFilter = activeSizeFilter,
                    onSizeFilterSelected = { filter -> activeSizeFilter = filter },
                    customStartMillis = customStartMillis,
                    customEndMillis = customEndMillis,
                    customRangeLabel = customRangeLabel,
                    onOpenCustomDateDialog = { showCustomDateDialog = true },
                    onOpenSaf = { safFolderPicker.launch(null) },
                    onOpenSettings = { showSettingsDialog = true },
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
                        val selectedList = if (discoveredItems.any { it.isSelected }) {
                            discoveredItems.filter { it.isSelected }
                        } else {
                            discoveredItems.filter { it.isRestorable }
                        }
                        if (selectedList.isNotEmpty() && !isRestoring) {
                            isRestoring = true
                            coroutineScope.launch {
                                val res = recoverEngine.restoreSelectedItems(selectedList)
                                isRestoring = false
                                restoreResult = res
                            }
                        }
                    },
                    onShareSelected = {
                        val selectedList = discoveredItems.filter { it.isSelected }
                        if (selectedList.isNotEmpty()) {
                            val shareIntent = recoverEngine.createShareIntent(selectedList)
                            if (shareIntent != null) {
                                context.startActivity(Intent.createChooser(shareIntent, if (isHindi) "फाइलें शेयर करें" else "Share Files"))
                            } else {
                                Toast.makeText(context, if (isHindi) "शेयर करने के लिए फाइल उपलब्ध नहीं" else "File not accessible for sharing", Toast.LENGTH_SHORT).show()
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
                },
                onShareSingle = {
                    val shareIntent = recoverEngine.createShareIntent(listOf(item))
                    if (shareIntent != null) {
                        context.startActivity(Intent.createChooser(shareIntent, if (isHindi) "शेयर करें" else "Share via"))
                    } else {
                        Toast.makeText(context, if (isHindi) "शेयर करने के लिए फाइल उपलब्ध नहीं" else "File not accessible for sharing", Toast.LENGTH_SHORT).show()
                    }
                },
                onShredCache = {
                    val deleted = recoverEngine.permanentlyDeleteCacheItem(item)
                    if (deleted) {
                        discoveredItems.removeAll { it.id == item.id }
                        previewItem = null
                        Toast.makeText(context, if (isHindi) "कैश फाइल स्थायी रूप से मिटा दी गई" else "Cache file shredded permanently", Toast.LENGTH_SHORT).show()
                    }
                }
            )
        }

        // Custom Date Range Dialog
        if (showCustomDateDialog) {
            CustomDateRangeDialog(
                isHindi = isHindi,
                onDismiss = { showCustomDateDialog = false },
                onApplyRange = { start, end, label ->
                    customStartMillis = start
                    customEndMillis = end
                    customRangeLabel = label
                    activeTimeFilter = TimeRangeFilter.CUSTOM
                    showCustomDateDialog = false
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
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Button(
                            onClick = {
                                try {
                                    context.startActivity(recoverEngine.openGalleryIntent())
                                } catch (_: Exception) {}
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2563EB), contentColor = Color.White),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(imageVector = Icons.Default.PhotoLibrary, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(text = if (isHindi) "गैलरी खोलें" else "Open Gallery", fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = {
                                restoreResult = null
                                startCategoryScan(RecoverCategory.VAULT)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Text(text = if (isHindi) "वॉल्ट देखें" else "Open Vault", fontWeight = FontWeight.Bold)
                        }
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

        // ── ⚙️ RECOVERY SETTINGS DIALOG ──
        if (showSettingsDialog) {
            RecoverySettingsDialog(
                isHindi = isHindi,
                settings = recoverSettings,
                onSettingsChanged = { recoverSettings = it },
                onClearCache = {
                    ThumbnailLoader.clearCache()
                    Toast.makeText(context, if (isHindi) "इंजन का कैश खाली कर दिया गया" else "Engine cache cleared", Toast.LENGTH_SHORT).show()
                },
                onDismiss = { showSettingsDialog = false }
            )
        }

        // ── ⚡ 1-CLICK ALL-IN-ONE RECOVERY PROGRESS MODAL ──
        if (isOneClickRunning) {
            Dialog(onDismissRequest = {}) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(Color(0xFF0B192C))
                        .border(1.5.dp, CyanAccent, RoundedCornerShape(20.dp))
                        .padding(24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(14.dp)
                    ) {
                        CircularProgressIndicator(
                            progress = { oneClickProgress },
                            modifier = Modifier.size(60.dp),
                            color = EmeraldAccent,
                            strokeWidth = 5.dp
                        )
                        Text(
                            text = if (isHindi) "⚡ 1-क्लिक ऑल-इन-वन रिकवरी चालू है" else "⚡ 1-Tap Auto Full Recovery",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black, color = Color.White),
                            textAlign = TextAlign.Center
                        )
                        Text(
                            text = oneClickPhase,
                            style = MaterialTheme.typography.bodySmall.copy(color = CyanAccent),
                            textAlign = TextAlign.Center
                        )
                        if (oneClickFoundCount > 0) {
                            Text(
                                text = if (isHindi) "खोजे गए: $oneClickFoundCount फाइलें" else "Found: $oneClickFoundCount files",
                                style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent, fontWeight = FontWeight.Bold)
                            )
                        }
                        LinearProgressIndicator(
                            progress = { oneClickProgress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(6.dp)
                                .clip(RoundedCornerShape(3.dp)),
                            color = EmeraldAccent,
                            trackColor = CardDark
                        )
                    }
                }
            }
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
    onOneClickAutoRecover: () -> Unit = {},
    onOpenSettings: () -> Unit = {},
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

            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = onOpenSettings,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(CardDark)
                ) {
                    Icon(
                        imageVector = Icons.Default.Settings,
                        contentDescription = "Settings",
                        tint = CyanAccent,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
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
        }

        Spacer(modifier = Modifier.height(14.dp))

        val context = LocalContext.current
        val hasStorageAccess = remember(context) { StorageRecoverEngine.hasStoragePermission(context) }
        if (!hasStorageAccess) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .clickable { StorageRecoverEngine.requestStoragePermission(context) },
                colors = CardDefaults.cardColors(containerColor = Color(0xFF3B1515)),
                border = BorderStroke(1.5.dp, Color(0xFFEF4444))
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(42.dp)
                            .background(Color(0xFFEF4444).copy(alpha = 0.2f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = null,
                            tint = Color(0xFFEF4444),
                            modifier = Modifier.size(22.dp)
                        )
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "⚠️ ऑल फाइल्स एक्सेस की अनुमति दें" else "⚠️ All Files Access Required",
                            style = MaterialTheme.typography.titleSmall.copy(fontWeight = FontWeight.Bold, color = Color.White)
                        )
                        Text(
                            text = if (isHindi)
                                "Play Store ऐप्स की तरह पुराने डिलीटेड फोटो/वीडियो निकालने के लिए अनुमति आवश्यक है।"
                            else
                                "Grant All Files Access to unearth deleted photo thumbnails and deep storage clusters.",
                            style = MaterialTheme.typography.bodySmall.copy(color = Color(0xFFFCA5A5), fontSize = 11.sp)
                        )
                    }
                    Button(
                        onClick = { StorageRecoverEngine.requestStoragePermission(context) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444), contentColor = Color.White),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                    ) {
                        Text(text = if (isHindi) "चालू करें" else "Allow", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
            Spacer(modifier = Modifier.height(14.dp))
        }

        // ── ⚡ 1-CLICK ALL-IN-ONE RECOVER BANNER ──
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(18.dp))
                .clickable { onOneClickAutoRecover() },
            colors = CardDefaults.cardColors(containerColor = Color(0xFF0F2537)),
            border = BorderStroke(1.5.dp, Brush.horizontalGradient(listOf(CyanAccent, EmeraldAccent)))
        ) {
            Row(
                modifier = Modifier.padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .background(
                            Brush.linearGradient(listOf(Color(0xFF0EA5E9), Color(0xFF10B981))),
                            shape = RoundedCornerShape(14.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.FlashOn,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = if (isHindi) "⚡ 1-क्लिक ऑल-इन-वन रिकवरी" else "⚡ 1-Tap All-in-One Recovery",
                            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black),
                            color = Color.White,
                            fontSize = 15.sp
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(EmeraldAccent)
                                .padding(horizontal = 6.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "AUTO",
                                color = BgDark,
                                fontWeight = FontWeight.Black,
                                fontSize = 9.sp
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = if (isHindi)
                            "पूरे फोन का डीप स्कैन करके फॉर्मेट, डिलीट व छुपी सभी फाइल्स को 1 ही बार में सीधे फोन गैलरी में सुरक्षित करें।"
                        else
                            "Deep scan entire phone & recover all deleted/formatted media directly to Gallery in 1 tap.",
                        style = MaterialTheme.typography.bodySmall.copy(fontSize = 11.sp),
                        color = TextSecondary
                    )
                }
                Icon(
                    imageVector = Icons.Default.ArrowForward,
                    contentDescription = null,
                    tint = CyanAccent,
                    modifier = Modifier.size(18.dp)
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
    activeTimeFilter: TimeRangeFilter = TimeRangeFilter.ALL,
    onTimeFilterSelected: (TimeRangeFilter) -> Unit = {},
    activeSizeFilter: SizeFilter = SizeFilter.ALL,
    onSizeFilterSelected: (SizeFilter) -> Unit = {},
    customStartMillis: Long = 0L,
    customEndMillis: Long = Long.MAX_VALUE,
    customRangeLabel: String = "",
    onOpenCustomDateDialog: () -> Unit = {},
    onOpenSaf: () -> Unit = {},
    onOpenSettings: () -> Unit = {},
    onToggleSelect: (RecoverItem) -> Unit,
    onToggleSelectAll: (Boolean) -> Unit,
    onPreviewItem: (RecoverItem) -> Unit,
    onBackToDashboard: () -> Unit,
    onRestoreSelected: () -> Unit,
    onShareSelected: () -> Unit = {},
    contentPadding: PaddingValues
) {
    val context = LocalContext.current

    val deletedCacheItems = remember(items.size) {
        items.filter {
            it.tier == RecoverTier.SYSTEM_TRASH ||
            it.tier == RecoverTier.THUMBNAIL_PREVIEW ||
            it.tier == RecoverTier.POST_FORMAT_RAW ||
            it.tier == RecoverTier.BYTE_CARVED ||
            it.id.startsWith("carved_") ||
            it.id.startsWith("trash_") ||
            it.id.startsWith("orphan_") ||
            it.id.startsWith("thumb_") ||
            it.id.startsWith("lostdir_") ||
            it.id.startsWith("ms_") ||
            it.sourcePath.contains("thumb", ignoreCase = true) ||
            it.sourcePath.contains("trash", ignoreCase = true) ||
            it.sourcePath.contains("LOST.DIR", ignoreCase = true)
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
            it.sourcePath.contains(".nomedia", ignoreCase = true) ||
            it.sourcePath.contains("Recording", ignoreCase = true) ||
            it.category == RecoverCategory.DOCUMENTS
        }
    }

    val now = remember { System.currentTimeMillis() }
    val oneYearAgo = remember(now) { now - 365L * 24 * 60 * 60 * 1000L }
    val twoYearsAgo = remember(now) { now - 2 * 365L * 24 * 60 * 60 * 1000L }
    val threeYearsAgo = remember(now) { now - 3 * 365L * 24 * 60 * 60 * 1000L }
    val fourYearsAgo = remember(now) { now - 4 * 365L * 24 * 60 * 60 * 1000L }
    val fiveYearsAgo = remember(now) { now - 5 * 365L * 24 * 60 * 60 * 1000L }
    val tenYearsAgo = remember(now) { now - 10 * 365L * 24 * 60 * 60 * 1000L }
    val twentyYearsAgo = remember(now) { now - 20 * 365L * 24 * 60 * 60 * 1000L }

    // Multi-dimensional Filtering: Source Tag + Time Range + Size/Quality
    val filteredList = remember(items.size, activeFilterTag, activeTimeFilter, activeSizeFilter, customStartMillis, customEndMillis) {
        val tagFiltered = when (activeFilterTag) {
            "DELETED_CACHE" -> deletedCacheItems.ifEmpty { items }
            "WHATSAPP_SOCIAL" -> socialItems.ifEmpty { items }
            "SAF_SCAN" -> safItems.ifEmpty { items }
            else -> items
        }

        tagFiltered.filter { item ->
            // Quality / Size Filter
            val passesSize = item.sizeBytes >= activeSizeFilter.minBytes

            // Time / Date Range Filter (Supports 1 to 20 years & post-format raw clusters)
            val passesTime = when (activeTimeFilter) {
                TimeRangeFilter.ALL -> true
                TimeRangeFilter.POST_FORMAT -> {
                    item.tier == RecoverTier.POST_FORMAT_RAW ||
                    item.tier == RecoverTier.BYTE_CARVED ||
                    item.qualityTag.contains("Post-Format", true) ||
                    item.sourcePath.contains("LOST.DIR", true) ||
                    item.sourcePath.contains("Thumbdata", true) ||
                    item.timestampMillis == 0L ||
                    item.timestampMillis <= twoYearsAgo
                }
                TimeRangeFilter.ONE_YEAR -> item.timestampMillis == 0L || item.timestampMillis >= oneYearAgo
                TimeRangeFilter.TWO_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= twoYearsAgo
                TimeRangeFilter.THREE_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= threeYearsAgo
                TimeRangeFilter.FOUR_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= fourYearsAgo
                TimeRangeFilter.FIVE_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= fiveYearsAgo
                TimeRangeFilter.TEN_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= tenYearsAgo
                TimeRangeFilter.TWENTY_YEARS -> item.timestampMillis == 0L || item.timestampMillis >= twentyYearsAgo
                TimeRangeFilter.CUSTOM -> {
                    if (item.timestampMillis == 0L) true
                    else item.timestampMillis in customStartMillis..customEndMillis
                }
            }
            passesSize && passesTime
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
                    .padding(horizontal = 12.dp, vertical = 6.dp),
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
                            text = if (isHindi) "3-कॉलम विज़ुअल ग्रिड • फ़िल्टर लागू" else "3-Column Grid • Filters Active",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 10.sp)
                        )
                    }
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onOpenSettings,
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(imageVector = Icons.Default.Settings, contentDescription = "Settings", tint = CyanAccent, modifier = Modifier.size(20.dp))
                    }
                    Spacer(modifier = Modifier.width(4.dp))
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
            }

            // ── ROW 1: MASTER RECOVERY SOURCE CHIPS ──
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 12.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                FilterTabChip(
                    label = if (isHindi) "🖼️ सभी (${items.size})" else "🖼️ All (${items.size})",
                    isSelected = activeFilterTag == "ALL",
                    onClick = { onFilterTagSelected("ALL") }
                )
                FilterTabChip(
                    label = if (isHindi) "🗑️ डिलीट व कैश (${deletedCacheItems.size})" else "🗑️ Deleted & Cache (${deletedCacheItems.size})",
                    isSelected = activeFilterTag == "DELETED_CACHE",
                    onClick = { onFilterTagSelected("DELETED_CACHE") }
                )
                FilterTabChip(
                    label = if (isHindi) "💬 WhatsApp (${socialItems.size})" else "💬 WhatsApp (${socialItems.size})",
                    isSelected = activeFilterTag == "WHATSAPP_SOCIAL",
                    onClick = { onFilterTagSelected("WHATSAPP_SOCIAL") }
                )
                FilterTabChip(
                    label = if (isHindi) "📂 SAF स्कैन (${safItems.size})" else "📂 SAF (${safItems.size})",
                    isSelected = activeFilterTag == "SAF_SCAN",
                    onClick = {
                        onFilterTagSelected("SAF_SCAN")
                        if (safItems.isEmpty()) onOpenSaf()
                    }
                )
            }

            // ── ROW 2: TIME-BASED FILTERS (1-YEAR, 2-YEAR, CUSTOM DATE) ──
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 12.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                TimeRangeFilter.values().forEach { filter ->
                    val isSelected = activeTimeFilter == filter
                    val label = if (filter == TimeRangeFilter.CUSTOM && customRangeLabel.isNotBlank()) {
                        "🗓️ $customRangeLabel"
                    } else {
                        if (isHindi) filter.labelHi else filter.labelEn
                    }
                    FilterTabChip(
                        label = label,
                        isSelected = isSelected,
                        onClick = { onTimeFilterSelected(filter) }
                    )
                }
            }

            // ── ROW 3: QUALITY & SIZE FILTERS ──
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState())
                    .padding(horizontal = 12.dp, vertical = 2.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                SizeFilter.values().forEach { filter ->
                    val isSelected = activeSizeFilter == filter
                    FilterTabChip(
                        label = if (isHindi) filter.labelHi else filter.labelEn,
                        isSelected = isSelected,
                        onClick = { onSizeFilterSelected(filter) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

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
                            text = if (isHindi) "इस फ़िल्टर में कोई फाइल नहीं मिली" else "No Files Matching Active Filter",
                            style = MaterialTheme.typography.titleMedium.copy(
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            ),
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = if (isHindi)
                                "फ़िल्टर बदलकर '📅 सभी समय' या '🔍 सभी साइज़' चुनें, या गहरे .thumbnails और WhatsApp फ़ोल्डरों को स्कैन करने के लिए नीचे टैप करें:"
                            else
                                "Change filter to 'All Time' or 'All Sizes', or deep scan hidden storage folders below:",
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

        // ── STICKY BOTTOM ACTION BAR (1-CLICK RECOVER ALL + DIRECT SHARE) ──
        if (items.isNotEmpty()) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(bottom = contentPadding.calculateBottomPadding())
                    .clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .background(Color(0xFF0F172A))
                    .border(1.dp, EmeraldAccent.copy(alpha = 0.5f), RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
                    .padding(12.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) {
                                if (selectedCount > 0) "$selectedCount फाइलें चुनी गईं" else "सभी ${items.size} फाइलें"
                            } else {
                                if (selectedCount > 0) "$selectedCount Selected" else "All ${items.size} Files"
                            },
                            style = MaterialTheme.typography.bodyMedium.copy(
                                fontWeight = FontWeight.Black,
                                color = EmeraldAccent
                            )
                        )
                        Text(
                            text = if (selectedCount > 0) {
                                "Size: %.1f MB".format(Locale.US, totalBytes / 1_000_000f)
                            } else {
                                if (isHindi) "1-क्लिक सभी गैलरी में सेव करें" else "1-Tap Save All to Gallery"
                            },
                            style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }

                    // Direct Share Button (WhatsApp / Apps)
                    OutlinedButton(
                        onClick = onShareSelected,
                        modifier = Modifier.height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = CyanAccent),
                        border = androidx.compose.foundation.BorderStroke(1.5.dp, CyanAccent)
                    ) {
                        Icon(imageVector = Icons.Default.Share, contentDescription = "Share", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isHindi) "शेयर" else "Share",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                        )
                    }

                    // Recover to Gallery Button
                    Button(
                        onClick = onRestoreSelected,
                        modifier = Modifier.height(48.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EmeraldAccent,
                            contentColor = BgDark
                        )
                    ) {
                        Icon(
                            imageVector = Icons.Default.SettingsBackupRestore,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = if (isHindi) {
                                if (selectedCount > 0) "रिकवर ($selectedCount)" else "सब कुछ रिकवर करें (${items.size})"
                            } else {
                                if (selectedCount > 0) "RECOVER ($selectedCount)" else "RECOVER ALL (${items.size})"
                            },
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
            item.id.startsWith("carved_") || item.tier == RecoverTier.BYTE_CARVED || item.sourcePath.contains("thumbdata", ignoreCase = true) ->
                Pair("CARVED", Color(0xFF0EA5E9))
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
    onRecoverSingle: () -> Unit,
    onShareSingle: () -> Unit = {},
    onShredCache: () -> Unit = {}
) {
    val fullBitmap by produceState<Bitmap?>(initialValue = null, key1 = item.id) {
        value = ThumbnailLoader.loadThumbnail(context, item, 800, 800)
    }

    var showShredConfirm by remember { mutableStateOf(false) }

    val formattedDate = remember(item.timestampMillis, item.dateModified) {
        if (item.timestampMillis > 0L) {
            try {
                SimpleDateFormat("dd MMM yyyy, hh:mm a", Locale.getDefault()).format(Date(item.timestampMillis))
            } catch (_: Exception) {
                item.dateModified
            }
        } else {
            item.dateModified
        }
    }

    val isCacheOrOrphan = remember(item.id, item.sourcePath) {
        item.id.startsWith("carved_") || item.id.startsWith("thumb_") || item.id.startsWith("orphan_") ||
        item.sourcePath.contains("thumb", ignoreCase = true) || item.sourcePath.contains("cache", ignoreCase = true)
    }

    if (showShredConfirm) {
        AlertDialog(
            onDismissRequest = { showShredConfirm = false },
            title = {
                Text(
                    text = if (isHindi) "⚠️ स्थायी रूप से मिटाएं?" else "⚠️ Permanently Shred?",
                    fontWeight = FontWeight.Bold,
                    color = RoseAccent
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "यह कैश्ड फाइल आपके डिवाइस से स्थायी रूप से मिटा दी जाएगी और इसे दोबारा नहीं देखा जा सकेगा।"
                    else
                        "This cached file will be permanently deleted from device storage.",
                    style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary)
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showShredConfirm = false
                        onShredCache()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = RoseAccent, contentColor = Color.White),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text(text = if (isHindi) "हाँ, मिटाएं" else "Yes, Shred", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showShredConfirm = false }) {
                    Text(text = if (isHindi) "रद्द करें" else "Cancel", color = TextSecondary)
                }
            },
            containerColor = Color(0xFF0F172A),
            shape = RoundedCornerShape(14.dp)
        )
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
                    text = "Size: %.2f MB • $formattedDate".format(Locale.US, item.sizeBytes / 1_000_000f),
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

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Status: ${item.tier.titleEn}",
                        style = MaterialTheme.typography.labelSmall.copy(
                            color = EmeraldAccent,
                            fontWeight = FontWeight.Bold
                        )
                    )

                    // Action buttons: Share & Shred
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        IconButton(
                            onClick = onShareSingle,
                            modifier = Modifier
                                .size(32.dp)
                                .background(CyanAccent.copy(alpha = 0.15f), CircleShape)
                        ) {
                            Icon(Icons.Default.Share, contentDescription = "Share", tint = CyanAccent, modifier = Modifier.size(16.dp))
                        }
                        if (isCacheOrOrphan) {
                            IconButton(
                                onClick = { showShredConfirm = true },
                                modifier = Modifier
                                    .size(32.dp)
                                    .background(RoseAccent.copy(alpha = 0.15f), CircleShape)
                            ) {
                                Icon(Icons.Default.DeleteForever, contentDescription = "Shred", tint = RoseAccent, modifier = Modifier.size(16.dp))
                            }
                        }
                    }
                }
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. CUSTOM DATE / YEAR RANGE DIALOG
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun CustomDateRangeDialog(
    isHindi: Boolean,
    onDismiss: () -> Unit,
    onApplyRange: (startMillis: Long, endMillis: Long, label: String) -> Unit
) {
    val currentYear = remember { Calendar.getInstance().get(Calendar.YEAR) }
    var selectedYear by remember { mutableStateOf(currentYear) }
    val years = remember {
        listOf(
            currentYear, currentYear - 1, currentYear - 2, currentYear - 3,
            currentYear - 4, currentYear - 5, currentYear - 6, currentYear - 7,
            currentYear - 8, currentYear - 9, currentYear - 10, currentYear - 20
        )
    }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.DateRange, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(22.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isHindi) "📅 तारीख या वर्ष चुनें (1-20 वर्ष)" else "📅 Select Year Range (1-20 Yrs)",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text(
                    text = if (isHindi) "त्वरित वर्ष चुनें (1 से 20 वर्ष तक):" else "Quick Year Selection (1 to 20 Years):",
                    style = MaterialTheme.typography.labelMedium.copy(color = TextSecondary, fontWeight = FontWeight.Bold)
                )

                // 3 Rows of 4 year chips each
                for (chunk in years.chunked(4)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        chunk.forEach { year ->
                            val isSelected = selectedYear == year
                            val label = if (year == currentYear - 20) "20 Yr" else "$year"
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(if (isSelected) CyanAccent else CardDark)
                                    .border(1.dp, if (isSelected) CyanAccent else CardBorder, RoundedCornerShape(8.dp))
                                    .clickable { selectedYear = year }
                                    .padding(vertical = 8.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = label,
                                    color = if (isSelected) BgDark else TextPrimary,
                                    fontWeight = if (isSelected) FontWeight.Black else FontWeight.Bold,
                                    fontSize = 11.sp
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = if (isHindi)
                        "वर्ष $selectedYear के दौरान कैप्चर, फॉर्मेट या डिलीट की गई सभी फाइलें फ़िल्टर होंगी।"
                    else
                        "Filters all files created, formatted, or deleted in $selectedYear.",
                    style = MaterialTheme.typography.bodySmall.copy(color = TextMuted, fontSize = 11.sp)
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val cal = Calendar.getInstance()
                    cal.set(selectedYear, Calendar.JANUARY, 1, 0, 0, 0)
                    val start = cal.timeInMillis
                    cal.set(selectedYear, Calendar.DECEMBER, 31, 23, 59, 59)
                    val end = cal.timeInMillis
                    onApplyRange(start, end, "$selectedYear")
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(text = if (isHindi) "लागू करें" else "Apply Filter", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = if (isHindi) "रद्द करें" else "Cancel", color = TextSecondary)
            }
        },
        containerColor = Color(0xFF0F172A),
        shape = RoundedCornerShape(16.dp)
    )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. RECOVERY SETTINGS DIALOG
// ─────────────────────────────────────────────────────────────────────────────

@Composable
fun RecoverySettingsDialog(
    isHindi: Boolean,
    settings: RecoverSettings,
    onSettingsChanged: (RecoverSettings) -> Unit,
    onClearCache: () -> Unit,
    onDismiss: () -> Unit
) {
    var postFormat by remember { mutableStateOf(settings.postFormatDeepScan) }
    var aggressiveCarving by remember { mutableStateOf(settings.aggressiveByteCarving) }
    var skipDuplicates by remember { mutableStateOf(settings.autoSkipDuplicates) }
    var forceScanner by remember { mutableStateOf(settings.forceMediaScannerSync) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Settings, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(24.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isHindi) "⚙️ रिकवरी सेटिंग्स" else "⚙️ Recovery Settings",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Black)
                )
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                // Post Format Deep Scan
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "फॉर्मेट रिकवरी मोड (1-20 वर्ष)" else "Post-Format Recovery Mode",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Color.White)
                        )
                        Text(
                            text = if (isHindi) "LOST.DIR व अनएलोकेटेड क्लस्टर्स को स्कैन करें" else "Scan LOST.DIR & raw unallocated blocks",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }
                    Switch(
                        checked = postFormat,
                        onCheckedChange = { postFormat = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = EmeraldAccent)
                    )
                }

                HorizontalDivider(color = CardBorder)

                // Ultra Deep Byte Carving
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "अल्ट्रा डीप बाइट कार्विंग" else "Ultra Deep Byte Carving",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Color.White)
                        )
                        Text(
                            text = if (isHindi) ".thumbdata से जेपेग/पीएनजी हेडर खोजें" else "Extract headers from raw .thumbdata caches",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }
                    Switch(
                        checked = aggressiveCarving,
                        onCheckedChange = { aggressiveCarving = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = CyanAccent)
                    )
                }

                HorizontalDivider(color = CardBorder)

                // Instant MediaScanner
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "गैलरी ऑटो-सिंक (MediaScanner)" else "Instant Gallery MediaScanner",
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = Color.White)
                        )
                        Text(
                            text = if (isHindi) "रीस्टोर होते ही गैलरी में तुरंत दिखाएं" else "Trigger broadcast so gallery shows files instantly",
                            style = MaterialTheme.typography.bodySmall.copy(color = TextSecondary, fontSize = 11.sp)
                        )
                    }
                    Switch(
                        checked = forceScanner,
                        onCheckedChange = { forceScanner = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = EmeraldAccent)
                    )
                }

                HorizontalDivider(color = CardBorder)

                // Destination Folder
                Column {
                    Text(
                        text = if (isHindi) "गैलरी सेव लोकेशन (Album):" else "Gallery Destination Album:",
                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold, color = Color.White)
                    )
                    Text(
                        text = "DCIM/SuperTelecom_Recovered",
                        style = MaterialTheme.typography.bodySmall.copy(color = CyanAccent, fontFamily = FontFamily.Monospace)
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Clear Cache Button
                OutlinedButton(
                    onClick = onClearCache,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AmberAccent),
                    border = BorderStroke(1.dp, AmberAccent)
                ) {
                    Icon(Icons.Default.CleaningServices, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = if (isHindi) "इंजन का अस्थायी कैश खाली करें" else "Clear Temporary Engine Cache")
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    onSettingsChanged(
                        settings.copy(
                            postFormatDeepScan = postFormat,
                            aggressiveByteCarving = aggressiveCarving,
                            autoSkipDuplicates = skipDuplicates,
                            forceMediaScannerSync = forceScanner
                        )
                    )
                    onDismiss()
                },
                colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark),
                shape = RoundedCornerShape(10.dp)
            ) {
                Text(text = if (isHindi) "सेव करें" else "Save Settings", fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(text = if (isHindi) "रद्द करें" else "Cancel", color = TextSecondary)
            }
        },
        containerColor = Color(0xFF0F172A),
        shape = RoundedCornerShape(16.dp)
    )
}

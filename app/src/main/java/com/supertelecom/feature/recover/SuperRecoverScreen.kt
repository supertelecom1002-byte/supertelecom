package com.supertelecom.feature.recover

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
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
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.RecoverItem
import com.supertelecom.model.RecoverTier
import com.supertelecom.theme.*
import kotlinx.coroutines.launch
import java.util.Locale

@Composable
fun SuperRecoverScreen(
    isHindi: Boolean,
    contentPadding: PaddingValues = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 120.dp)
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    val recoverEngine = remember { StorageRecoverEngine(context) }

    var selectedCategory by remember { mutableStateOf(RecoverCategory.ALL_MEDIA) }
    var selectedTierFilter by remember { mutableStateOf<RecoverTier?>(null) }
    var showPreviewItem by remember { mutableStateOf<RecoverItem?>(null) }
    var restoreResult by remember { mutableStateOf<Triple<Int, Int, String>?>(null) }
    var isRestoring by remember { mutableStateOf(false) }

    val isScanning by recoverEngine.isScanning.collectAsState()
    val currentScanPath by recoverEngine.currentScanPath.collectAsState()

    // Production Discovered Items: Starts EMPTY (zero hardcoded sample records)
    val discoveredItems = remember { mutableStateListOf<RecoverItem>() }

    // Storage Access Framework (SAF) Folder Picker
    val safFolderPicker = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.OpenDocumentTree()
    ) { treeUri: Uri? ->
        if (treeUri != null) {
            coroutineScope.launch {
                val results = recoverEngine.scanStorageAccessTree(treeUri, selectedCategory)
                discoveredItems.addAll(0, results)
            }
        }
    }

    val filteredItems = remember(selectedCategory, selectedTierFilter, discoveredItems.size) {
        discoveredItems.filter {
            val matchCat = (selectedCategory == RecoverCategory.ALL_MEDIA || it.category == selectedCategory)
            val matchTier = (selectedTierFilter == null || it.tier == selectedTierFilter)
            matchCat && matchTier
        }
    }

    val selectedCount = discoveredItems.count { it.isSelected }
    val selectedTotalBytes = discoveredItems.filter { it.isSelected }.sumOf { it.sizeBytes }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding(),
            contentPadding = PaddingValues(
                start = 16.dp,
                end = 16.dp,
                top = 12.dp,
                bottom = contentPadding.calculateBottomPadding() + 80.dp // Extra space for sticky restore bar
            )
        ) {
            item {
                // ── HEADER ──
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
                                color = EmeraldAccent,
                                fontSize = 20.sp
                            )
                        )
                        Text(
                            text = if (isHindi) "सच्चा ऑन-डिवाइस मीडिया रिकवरी इंजन • शून्य रूट खतरा" else "Honest On-Device Media Recovery • Zero Root Exploit",
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
                            text = if (isHindi) "100% ऑन-डिवाइस" else "100% On-Device",
                            style = MaterialTheme.typography.labelSmall.copy(
                                color = EmeraldAccent,
                                fontWeight = FontWeight.Bold,
                                fontSize = 10.sp
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // ── STEP 1: 5 DISTINCT CATEGORY BUTTONS ──
                Text(
                    text = if (isHindi) "स्टेप 1 — क्या रिकवर करना है? (5 कैटेगरी)" else "Step 1 — What to Recover? (5 Categories)",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    CategoryFilterChip(
                        label = if (isHindi) "सभी" else "All",
                        isSelected = selectedCategory == RecoverCategory.ALL_MEDIA,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedCategory = RecoverCategory.ALL_MEDIA }
                    )
                    CategoryFilterChip(
                        label = if (isHindi) "तस्वीरें" else "Photos",
                        isSelected = selectedCategory == RecoverCategory.PHOTOS,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedCategory = RecoverCategory.PHOTOS }
                    )
                    CategoryFilterChip(
                        label = if (isHindi) "वीडियो" else "Videos",
                        isSelected = selectedCategory == RecoverCategory.VIDEOS,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedCategory = RecoverCategory.VIDEOS }
                    )
                    CategoryFilterChip(
                        label = if (isHindi) "ऑडियो" else "Audio",
                        isSelected = selectedCategory == RecoverCategory.AUDIO_RECORDINGS,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedCategory = RecoverCategory.AUDIO_RECORDINGS }
                    )
                    CategoryFilterChip(
                        label = if (isHindi) "दस्तावेज़" else "Docs",
                        isSelected = selectedCategory == RecoverCategory.DOCUMENTS,
                        modifier = Modifier.weight(1f),
                        onClick = { selectedCategory = RecoverCategory.DOCUMENTS }
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // ── STEP 2: SCAN ACTION BUTTONS (MIN 52DP HEIGHT) ──
                Text(
                    text = if (isHindi) "स्टेप 2 — रिकवरी स्कैन चलाएं" else "Step 2 — Execute Recovery Scan",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                Spacer(modifier = Modifier.height(10.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    // Deep Scan Button
                    Button(
                        onClick = {
                            coroutineScope.launch {
                                val results = recoverEngine.executeDeepScan(selectedCategory)
                                discoveredItems.clear()
                                discoveredItems.addAll(results)
                            }
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(54.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isScanning) RoseAccent else EmeraldAccent,
                            contentColor = if (isScanning) Color.White else BgDark
                        ),
                        enabled = !isScanning
                    ) {
                        Icon(
                            imageVector = if (isScanning) Icons.Default.HourglassEmpty else Icons.Default.Search,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isScanning)
                                (if (isHindi) "स्कैनिंग जारी..." else "SCANNING...")
                            else
                                (if (isHindi) "डीप स्कैन शुरू करें" else "START DEEP SCAN"),
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Black)
                        )
                    }

                    // SAF Folder Picker Button
                    OutlinedButton(
                        onClick = {
                            safFolderPicker.launch(null)
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(54.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder),
                        enabled = !isScanning
                    ) {
                        Icon(
                            imageVector = Icons.Default.FolderOpen,
                            contentDescription = null,
                            tint = CyanAccent,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isHindi) "SD कार्ड / SAF चुनें" else "SELECT FOLDER (SAF)",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }

                // Live Scan Indicator
                if (isScanning) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(CardDark)
                            .border(1.dp, EmeraldAccent.copy(alpha = 0.4f), RoundedCornerShape(10.dp))
                            .padding(10.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(18.dp),
                                color = EmeraldAccent,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Column {
                                Text(
                                    text = if (isHindi) "लाइव मीडिया स्कैन प्रगति पर है..." else "Live MediaScan in progress...",
                                    style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = currentScanPath,
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        fontSize = 10.sp,
                                        color = TextSecondary,
                                        fontFamily = FontFamily.Monospace
                                    ),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // ── STEP 3: DISCOVERED ITEMS LIST HEADER ──
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isHindi) "बरामद करने योग्य फाइलें (${filteredItems.size})" else "Recoverable Media (${filteredItems.size})",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )

                    if (discoveredItems.isNotEmpty()) {
                        Row {
                            TextButton(onClick = {
                                for (i in discoveredItems.indices) {
                                    discoveredItems[i] = discoveredItems[i].copy(isSelected = true)
                                }
                            }) {
                                Text(
                                    text = if (isHindi) "सब चुनें" else "Select All",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent, fontWeight = FontWeight.Bold)
                                )
                            }

                            TextButton(onClick = {
                                for (i in discoveredItems.indices) {
                                    discoveredItems[i] = discoveredItems[i].copy(isSelected = false)
                                }
                            }) {
                                Text(
                                    text = if (isHindi) "अनचेक" else "Deselect",
                                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(6.dp))
            }

            // Genuine Empty State when 0 files found
            if (discoveredItems.isEmpty() && !isScanning) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(CardDark.copy(alpha = 0.5f))
                            .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                            .padding(24.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                imageVector = Icons.Default.SearchOff,
                                contentDescription = null,
                                tint = TextMuted,
                                modifier = Modifier.size(36.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = if (isHindi) "कोई बरामदगी योग्य फ़ाइल नहीं मिली" else "No Recoverable Media Discovered",
                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = TextSecondary)
                            )
                            Text(
                                text = if (isHindi)
                                    "आधुनिक एंड्रॉइड (Android 10+) में फ़ाइल-आधारित एन्क्रिप्शन (FBE) और स्कोप्ड स्टोरेज लागू होता है। स्थायी रूप से मिटाई गई फ़ाइलें जिनका डिस्क ब्लॉक ट्रिम या ओवरराइट हो चुका है, बिना बैकअप के रिकवर नहीं हो सकती हैं।"
                                else
                                    "Modern Android (10+) utilizes hardware File-Based Encryption (FBE) and Scoped Storage. Permanently trimmed flash NAND blocks cannot be reconstructed without existing backups or surviving cache copies.",
                                style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, textAlign = TextAlign.Center),
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
            }

            // Items List
            itemsIndexed(filteredItems) { _, item ->
                RecoverItemCard(
                    item = item,
                    isHindi = isHindi,
                    onToggleSelect = {
                        val realIndex = discoveredItems.indexOfFirst { it.id == item.id }
                        if (realIndex != -1) {
                            discoveredItems[realIndex] = discoveredItems[realIndex].copy(
                                isSelected = !discoveredItems[realIndex].isSelected
                            )
                        }
                    },
                    onPreview = { showPreviewItem = item }
                )
                Spacer(modifier = Modifier.height(6.dp))
            }
        }

        // ── STICKY BOTTOM BAR: RESTORE SELECTED FILES (MIN 52DP HEIGHT) ──
        if (selectedCount > 0) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
                    .padding(bottom = contentPadding.calculateBottomPadding())
                    .clip(RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp))
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
                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, color = EmeraldAccent)
                        )
                        Text(
                            text = "Total: %.1f MB".format(Locale.US, selectedTotalBytes / 1_000_000f),
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 11.sp)
                        )
                    }

                    Button(
                        onClick = {
                            val selectedList = discoveredItems.filter { it.isSelected }
                            if (selectedList.isEmpty()) return@Button
                            isRestoring = true
                            coroutineScope.launch {
                                val result = recoverEngine.restoreSelectedItems(selectedList)
                                isRestoring = false
                                restoreResult = result
                            }
                        },
                        modifier = Modifier
                            .height(52.dp)
                            .defaultMinSize(minWidth = 180.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = EmeraldAccent,
                            contentColor = BgDark
                        ),
                        enabled = selectedCount > 0 && !isRestoring
                    ) {
                        Icon(
                            imageVector = Icons.Default.SettingsBackupRestore,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isRestoring)
                                (if (isHindi) "रीस्टोर जारी..." else "RESTORING...")
                            else
                                (if (isHindi) "फाइलें रीस्टोर करें" else "RESTORE SELECTED"),
                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Black)
                        )
                    }
                }
            }
        }
    }

    // ── ITEM PREVIEW MODAL ──
    showPreviewItem?.let { item ->
        AlertDialog(
            onDismissRequest = { showPreviewItem = null },
            title = {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            },
            text = {
                Column {
                    Text(
                        text = "Source: ${item.sourcePath}",
                        style = MaterialTheme.typography.bodySmall.copy(fontFamily = FontFamily.Monospace)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(text = "Date: ${item.dateModified}", style = MaterialTheme.typography.bodySmall)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Size: %.2f MB".format(Locale.US, item.sizeBytes / 1_000_000f),
                        style = MaterialTheme.typography.bodySmall
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Tier: ${item.tier.titleEn}",
                        style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { showPreviewItem = null },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                    modifier = Modifier.height(44.dp)
                ) {
                    Text(text = if (isHindi) "बंद करें" else "Close")
                }
            },
            containerColor = CardDark
        )
    }

    // ── RESTORE RESULT DIALOG ──
    restoreResult?.let { (successCount, failedCount, path) ->
        AlertDialog(
            onDismissRequest = { restoreResult = null },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = if (successCount > 0) Icons.Default.CheckCircle else Icons.Default.Error,
                        contentDescription = null,
                        tint = if (successCount > 0) EmeraldAccent else RoseAccent
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isHindi) "रीस्टोर परिणाम" else "Restore Complete",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                    )
                }
            },
            text = {
                Column {
                    Text(
                        text = if (isHindi)
                            "$successCount फाइलें बिना किसी ओवरराइट के सुरक्षित रूप से रीस्टोर कर दी गई हैं।"
                        else
                            "$successCount files safely restored without overwriting existing data.",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    if (failedCount > 0) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isHindi)
                                "$failedCount फाइलें स्रोत अनुपलब्ध होने के कारण नहीं पढ़ी जा सकीं।"
                            else
                                "$failedCount file(s) were inaccessible from storage source.",
                            style = MaterialTheme.typography.bodySmall.copy(color = RoseAccent)
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Saved to: $path",
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontFamily = FontFamily.Monospace,
                            color = CyanAccent,
                            fontSize = 11.sp
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = { restoreResult = null },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark),
                    modifier = Modifier.height(48.dp)
                ) {
                    Text(text = if (isHindi) "ठीक है (OK)" else "OK")
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun CategoryFilterChip(
    label: String,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(40.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) EmeraldAccent else CardDark)
            .border(1.dp, if (isSelected) EmeraldAccent else CardBorder, RoundedCornerShape(8.dp))
            .clickable { onClick() }
            .padding(horizontal = 4.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.labelSmall.copy(
                fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                fontSize = 10.sp,
                color = if (isSelected) BgDark else TextPrimary
            ),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}

@Composable
private fun RecoverItemCard(
    item: RecoverItem,
    isHindi: Boolean,
    onToggleSelect: () -> Unit,
    onPreview: () -> Unit
) {
    val sizeText = when {
        item.sizeBytes >= 1_000_000_000L -> "%.2f GB".format(Locale.US, item.sizeBytes / 1_000_000_000f)
        item.sizeBytes >= 1_000_000L -> "%.1f MB".format(Locale.US, item.sizeBytes / 1_000_000f)
        item.sizeBytes > 0 -> "${item.sizeBytes / 1024} KB"
        else -> "0 KB"
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(
                1.dp,
                if (item.isSelected) EmeraldAccent.copy(alpha = 0.6f) else CardBorder,
                RoundedCornerShape(12.dp)
            )
            .clickable { onToggleSelect() }
            .padding(10.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = item.isSelected,
                onCheckedChange = { onToggleSelect() },
                colors = CheckboxDefaults.colors(
                    checkedColor = EmeraldAccent,
                    checkmarkColor = BgDark,
                    uncheckedColor = TextMuted
                ),
                modifier = Modifier.size(24.dp)
            )

            Spacer(modifier = Modifier.width(10.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = sizeText,
                        style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontSize = 10.sp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "• ${item.dateModified}",
                        style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 10.sp)
                    )
                }
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.tier.code + ": " + item.tier.titleEn,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontSize = 9.sp,
                            color = Color(item.tier.badgeColorHex),
                            fontWeight = FontWeight.Bold
                        )
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = item.sourcePath,
                        style = MaterialTheme.typography.labelSmall.copy(
                            fontSize = 9.sp,
                            color = TextMuted,
                            fontFamily = FontFamily.Monospace
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }

            IconButton(
                onClick = onPreview,
                modifier = Modifier.size(32.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Visibility,
                    contentDescription = "Preview",
                    tint = TextMuted,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}

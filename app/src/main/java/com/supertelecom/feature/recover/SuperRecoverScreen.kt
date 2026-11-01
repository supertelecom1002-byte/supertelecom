package com.supertelecom.feature.recover

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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.supertelecom.model.RecoverCategory
import com.supertelecom.model.RecoverItem
import com.supertelecom.model.RecoverTier
import com.supertelecom.theme.*

@Composable
fun SuperRecoverScreen(isHindi: Boolean) {
    var selectedCategory by remember { mutableStateOf(RecoverCategory.ALL_MEDIA) }
    var activeFilterTier by remember { mutableStateOf<RecoverTier?>(null) }
    var isScanning by remember { mutableStateOf(false) }
    var currentScanPath by remember { mutableStateOf("/storage/emulated/0/DCIM/.trashed-1002/...") }
    var showPreviewItem by remember { mutableStateOf<RecoverItem?>(null) }
    var showRestoreSuccessDialog by remember { mutableStateOf(false) }

    // Mock Discovered Recoverable Items categorized by 4-Tier Engine
    val discoveredItems = remember {
        mutableStateListOf(
            RecoverItem(
                id = "1",
                name = "IMG_20261018_FamilyGiridih.jpg",
                sizeBytes = 4_850_000L,
                dateModified = "18 Oct 2026",
                sourcePath = "Internal > DCIM > .trashed-1002",
                category = RecoverCategory.PHOTOS,
                tier = RecoverTier.ORIGINAL_MEDIA,
                qualityTag = "Original High-Res",
                isSelected = true
            ),
            RecoverItem(
                id = "2",
                name = "VID_20260905_KhandoliDam.mp4",
                sizeBytes = 85_400_000L,
                dateModified = "05 Sep 2026",
                sourcePath = "Internal > Android > media > app_cache > vid_copy.mp4",
                category = RecoverCategory.VIDEOS,
                tier = RecoverTier.HIDDEN_COPIES,
                qualityTag = "1080p Hidden Copy",
                isSelected = true
            ),
            RecoverItem(
                id = "3",
                name = "BILL_RECEIPT_STATION_ROAD.jpg",
                sizeBytes = 210_000L,
                dateModified = "12 Aug 2026",
                sourcePath = "Internal > .thumbnails > .thumbdata4--1962",
                category = RecoverCategory.PHOTOS,
                tier = RecoverTier.THUMBNAIL_PREVIEWS,
                qualityTag = "Thumbnail Preview",
                isSelected = false
            ),
            RecoverItem(
                id = "4",
                name = "Call_Recording_Business_01.m4a",
                sizeBytes = 3_200_000L,
                dateModified = "28 Jul 2026",
                sourcePath = "Internal > Recordings > Call > .hidden_trash",
                category = RecoverCategory.AUDIO_RECORDINGS,
                tier = RecoverTier.ORIGINAL_MEDIA,
                qualityTag = "Original Audio",
                isSelected = false
            ),
            RecoverItem(
                id = "5",
                name = "Aadhaar_Document_Scan.pdf",
                sizeBytes = 1_800_000L,
                dateModified = "02 Jun 2026",
                sourcePath = "Internal > Documents > Backup Target Identified",
                category = RecoverCategory.DOCUMENTS,
                tier = RecoverTier.BACKUP_RESTORATION,
                qualityTag = "External Backup",
                isSelected = false
            )
        )
    }

    val filteredList = remember(selectedCategory, activeFilterTier, discoveredItems.size) {
        discoveredItems.filter { item ->
            val matchCategory = selectedCategory == RecoverCategory.ALL_MEDIA || item.category == selectedCategory
            val matchTier = activeFilterTier == null || item.tier == activeFilterTier
            matchCategory && matchTier
        }
    }

    val selectedCount = discoveredItems.count { it.isSelected }

    Box(modifier = Modifier.fillMaxSize().background(BgDark)) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding(),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 130.dp)
        ) {
            item {
                // Header
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
                            text = if (isHindi) "सच्चा ऑन-डिवाइस मीडिया रिकवरी इंजन • शून्य रूट खतरा" else "Honest On-Device Storage Recovery • Zero Root Exploit",
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
                            text = "DPDP 2027 Safe",
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = FontWeight.Bold,
                                color = EmeraldAccent,
                                fontSize = 10.sp
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // ── STEP 1: WHAT TO RECOVER? 6 CATEGORIES ──
                Text(
                    text = if (isHindi) "स्टेप 1 — आपको क्या रिकवर करना है? (कैटेगरी चुनें)" else "Step 1 — What do you want to recover?",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // 6 Category Grid (2 columns x 3 rows)
                val categories = RecoverCategory.values()
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    for (i in categories.indices step 2) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            val cat1 = categories[i]
                            val isSel1 = selectedCategory == cat1
                            CategoryCard(
                                title = if (isHindi) cat1.labelHi else cat1.labelEn,
                                sub = cat1.extensions,
                                isSelected = isSel1,
                                modifier = Modifier.weight(1f),
                                onClick = { selectedCategory = cat1 }
                            )

                            if (i + 1 < categories.size) {
                                val cat2 = categories[i + 1]
                                val isSel2 = selectedCategory == cat2
                                CategoryCard(
                                    title = if (isHindi) cat2.labelHi else cat2.labelEn,
                                    sub = cat2.extensions,
                                    isSelected = isSel2,
                                    modifier = Modifier.weight(1f),
                                    onClick = { selectedCategory = cat2 }
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // ── STEP 2: SCAN ACTION BUTTONS ──
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
                            isScanning = !isScanning
                            if (isScanning) {
                                currentScanPath = "/storage/emulated/0/DCIM/.trashed-1002"
                            }
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isScanning) RoseAccent else EmeraldAccent,
                            contentColor = if (isScanning) Color.White else BgDark
                        )
                    ) {
                        Icon(
                            imageVector = if (isScanning) Icons.Default.Stop else Icons.Default.Search,
                            contentDescription = null,
                            modifier = Modifier.size(18.dp)
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isScanning) (if (isHindi) "स्कैन रोकें" else "Stop Scan") else (if (isHindi) "डीप स्कैन शुरू करें" else "START DEEP SCAN"),
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                        )
                    }

                    // SAF Folder Picker Button
                    OutlinedButton(
                        onClick = {
                            // Mock SAF picker trigger
                            isScanning = true
                            currentScanPath = "SD Card / Custom Storage Access Framework Tree"
                        },
                        modifier = Modifier
                            .weight(1f)
                            .height(52.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = TextPrimary),
                        border = androidx.compose.foundation.BorderStroke(1.dp, CardBorder)
                    ) {
                        Icon(imageVector = Icons.Default.FolderOpen, contentDescription = null, tint = CyanAccent, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = if (isHindi) "फोल्डर/SD कार्ड चुनें" else "SELECT FOLDER (SAF)",
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
                            .border(1.dp, CardBorder, RoundedCornerShape(10.dp))
                            .padding(10.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = if (isHindi) "स्कैनिंग जारी है..." else "Scanning in progress...",
                                    style = MaterialTheme.typography.labelSmall.copy(color = EmeraldAccent, fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "342 files checked",
                                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 10.sp)
                                )
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            LinearProgressIndicator(
                                modifier = Modifier.fillMaxWidth().height(4.dp).clip(RoundedCornerShape(2.dp)),
                                color = EmeraldAccent,
                                trackColor = CardBorder
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "Path: $currentScanPath",
                                style = MaterialTheme.typography.labelSmall.copy(fontSize = 10.sp, color = TextMuted),
                                maxLines = 1
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // ── STEP 3: 4 FILTER TABS ──
                Text(
                    text = if (isHindi) "स्टेप 3 — रिकवरी रिजल्ट्स (${filteredList.size} फाइलें)" else "Step 3 — Filter Discovered Results (${filteredList.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // 4 Tier Filter Pills
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    TierFilterChip(
                        title = if (isHindi) "सभी (All)" else "All Tiers",
                        isSelected = activeFilterTier == null,
                        color = TextPrimary,
                        modifier = Modifier.weight(1f),
                        onClick = { activeFilterTier = null }
                    )
                    TierFilterChip(
                        title = if (isHindi) "1. मूल फाइल" else "1. Originals",
                        isSelected = activeFilterTier == RecoverTier.ORIGINAL_MEDIA,
                        color = EmeraldAccent,
                        modifier = Modifier.weight(1f),
                        onClick = { activeFilterTier = RecoverTier.ORIGINAL_MEDIA }
                    )
                    TierFilterChip(
                        title = if (isHindi) "2. हिडन कॉपी" else "2. Hidden",
                        isSelected = activeFilterTier == RecoverTier.HIDDEN_COPIES,
                        color = CyanAccent,
                        modifier = Modifier.weight(1f),
                        onClick = { activeFilterTier = RecoverTier.HIDDEN_COPIES }
                    )
                    TierFilterChip(
                        title = if (isHindi) "3. थंबनेल" else "3. Previews",
                        isSelected = activeFilterTier == RecoverTier.THUMBNAIL_PREVIEWS,
                        color = AmberAccent,
                        modifier = Modifier.weight(1f),
                        onClick = { activeFilterTier = RecoverTier.THUMBNAIL_PREVIEWS }
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Select All Controls
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = if (isHindi) "$selectedCount फाइलें चुनी गईं" else "$selectedCount files selected",
                        style = MaterialTheme.typography.labelSmall.copy(color = TextSecondary, fontWeight = FontWeight.Bold)
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text(
                            text = if (isHindi) "सभी चुनें (Select All)" else "Select All",
                            style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent, fontWeight = FontWeight.Bold),
                            modifier = Modifier.clickable {
                                discoveredItems.indices.forEach { idx ->
                                    discoveredItems[idx] = discoveredItems[idx].copy(isSelected = true)
                                }
                            }
                        )
                        Text(
                            text = if (isHindi) "हटाएं (Deselect)" else "Clear",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted),
                            modifier = Modifier.clickable {
                                discoveredItems.indices.forEach { idx ->
                                    discoveredItems[idx] = discoveredItems[idx].copy(isSelected = false)
                                }
                            }
                        )
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
            }

            // Results List
            items(filteredList) { item ->
                RecoverItemCard(
                    item = item,
                    isHindi = isHindi,
                    onToggleSelect = {
                        val index = discoveredItems.indexOf(item)
                        if (index != -1) {
                            discoveredItems[index] = item.copy(isSelected = !item.isSelected)
                        }
                    },
                    onPreview = { showPreviewItem = item }
                )
                Spacer(modifier = Modifier.height(8.dp))
            }

            item {
                Spacer(modifier = Modifier.height(14.dp))

                // Honest Disclaimer
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(CardDark)
                        .border(1.dp, CardBorder, RoundedCornerShape(12.dp))
                        .padding(12.dp)
                ) {
                    Column {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Info, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (isHindi) "सच्ची तकनीकी गारंटी (Zero Fake Promises)" else "Technical Disclosure Guarantee",
                                style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AmberAccent)
                            )
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = if (isHindi)
                                "एंड्रॉयड फाइल-बेस्ड एन्क्रिप्शन (FBE) के कारण पूरी तरह मिट चुके स्टोरेज ब्लॉक कोई ऐप नहीं ला सकता। हमारा इंजन केवल सिस्टम ट्रैश, छुपे हुए कैश फोल्डर्स व थंबनेल स्टोर्स से असली बची हुई फाइलों को ईमानदारी से ढूंढता है।"
                            else
                                "Android File-Based Encryption prevents software from decrypting overwritten blocks without hardware chip-off. We honestly extract files from MediaStore trash, hidden app caches & thumbnail databases.",
                            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp, color = TextSecondary)
                        )
                    }
                }
            }
        }

        // ── STEP 4: STICKY BOTTOM RESTORE BAR ──
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(CardDark.copy(alpha = 0.96f))
                .border(1.dp, CardBorder)
                .padding(horizontal = 16.dp, vertical = 10.dp)
        ) {
            Button(
                onClick = {
                    if (selectedCount > 0) {
                        showRestoreSuccessDialog = true
                    }
                },
                enabled = selectedCount > 0,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = EmeraldAccent,
                    contentColor = BgDark,
                    disabledContainerColor = CardBorder,
                    disabledContentColor = TextMuted
                )
            ) {
                Icon(imageVector = Icons.Default.Save, contentDescription = null, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isHindi)
                        "💾 चयनित फाइलें फोन में सेव करें ($selectedCount RESTORE)"
                    else
                        "RESTORE SELECTED FILES ($selectedCount) TO DEVICE",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp
                    )
                )
            }
        }
    }

    // Preview Dialog
    showPreviewItem?.let { item ->
        AlertDialog(
            onDismissRequest = { showPreviewItem = null },
            title = {
                Text(
                    text = item.name,
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    maxLines = 1
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(160.dp)
                            .background(Color.Black, RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = when (item.category) {
                                RecoverCategory.PHOTOS -> Icons.Default.Photo
                                RecoverCategory.VIDEOS -> Icons.Default.Videocam
                                RecoverCategory.AUDIO_RECORDINGS -> Icons.Default.Mic
                                RecoverCategory.MUSIC -> Icons.Default.MusicNote
                                else -> Icons.Default.Description
                            },
                            contentDescription = null,
                            tint = CyanAccent,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                    Text(
                        text = "Size: ${(item.sizeBytes / 1_000_000.0).format(2)} MB • ${item.dateModified}",
                        style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                    )
                    Text(
                        text = "Source: ${item.sourcePath}",
                        style = MaterialTheme.typography.labelSmall.copy(color = CyanAccent)
                    )
                    Text(
                        text = "Classification: ${item.tier.titleEn} (${item.qualityTag})",
                        style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = EmeraldAccent)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val index = discoveredItems.indexOf(item)
                        if (index != -1) {
                            discoveredItems[index] = item.copy(isSelected = true)
                        }
                        showPreviewItem = null
                        showRestoreSuccessDialog = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "अभी रीस्टोर करें" else "Restore Now")
                }
            },
            dismissButton = {
                TextButton(onClick = { showPreviewItem = null }) {
                    Text(text = if (isHindi) "बंद करें" else "Close", color = TextSecondary)
                }
            },
            containerColor = CardDark
        )
    }

    // Success Dialog
    if (showRestoreSuccessDialog) {
        AlertDialog(
            onDismissRequest = { showRestoreSuccessDialog = false },
            icon = {
                Icon(Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldAccent, modifier = Modifier.size(36.dp))
            },
            title = {
                Text(
                    text = if (isHindi) "✅ सफलतापूर्वक रिकवर हो गया!" else "Files Restored Successfully!",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "$selectedCount फाइलें आपके चुने हुए सुरक्षित फोल्डर 'Internal Storage > SuperRecover_Restored/' में बिना पुरानी फाइलों को ओवरराइट किए सेव हो गई हैं।"
                    else
                        "$selectedCount files restored into 'Internal Storage > SuperRecover_Restored/' with verified SHA-256 integrity.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                Button(
                    onClick = { showRestoreSuccessDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "पूर्ण" else "Done")
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun CategoryCard(
    title: String,
    sub: String,
    isSelected: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(56.dp)
            .clip(RoundedCornerShape(12.dp))
            .background(if (isSelected) EmeraldAccent.copy(alpha = 0.15f) else CardDark)
            .border(1.dp, if (isSelected) EmeraldAccent else CardBorder, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 10.dp, vertical = 6.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxSize()) {
            RadioButton(
                selected = isSelected,
                onClick = onClick,
                colors = RadioButtonDefaults.colors(selectedColor = EmeraldAccent)
            )
            Spacer(modifier = Modifier.width(4.dp))
            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        color = if (isSelected) TextPrimary else TextSecondary
                    )
                )
                Text(text = sub, style = MaterialTheme.typography.labelSmall.copy(fontSize = 9.sp, color = TextMuted), maxLines = 1)
            }
        }
    }
}

@Composable
private fun TierFilterChip(
    title: String,
    isSelected: Boolean,
    color: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .height(34.dp)
            .clip(RoundedCornerShape(8.dp))
            .background(if (isSelected) color.copy(alpha = 0.2f) else CardDark)
            .border(1.dp, if (isSelected) color else CardBorder, RoundedCornerShape(8.dp))
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.labelSmall.copy(
                fontSize = 10.sp,
                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                color = if (isSelected) color else TextSecondary
            )
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
    val tier = item.tier
    val badgeColor = Color(tier.badgeColorHex)

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(CardDark)
            .border(1.dp, if (item.isSelected) EmeraldAccent else CardBorder, RoundedCornerShape(12.dp))
            .padding(10.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(
                checked = item.isSelected,
                onCheckedChange = { onToggleSelect() },
                colors = CheckboxDefaults.colors(checkedColor = EmeraldAccent, checkmarkColor = BgDark)
            )

            Spacer(modifier = Modifier.width(6.dp))

            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = item.name,
                        style = MaterialTheme.typography.titleMedium.copy(fontSize = 12.sp, fontWeight = FontWeight.Bold),
                        maxLines = 1,
                        modifier = Modifier.weight(1f)
                    )
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(6.dp))
                            .background(badgeColor.copy(alpha = 0.15f))
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = if (isHindi) tier.titleHi else tier.titleEn,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = badgeColor
                            )
                        )
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = "${(item.sizeBytes / 1_000_000.0).format(2)} MB • ${item.dateModified} • ${item.qualityTag}",
                    style = MaterialTheme.typography.labelSmall.copy(color = TextMuted, fontSize = 10.sp)
                )

                Text(
                    text = item.sourcePath,
                    style = MaterialTheme.typography.bodyMedium.copy(fontSize = 9.sp, color = TextSecondary),
                    maxLines = 1
                )
            }

            Spacer(modifier = Modifier.width(6.dp))

            IconButton(onClick = onPreview, modifier = Modifier.size(32.dp)) {
                Icon(Icons.Default.Visibility, contentDescription = "Preview", tint = CyanAccent, modifier = Modifier.size(18.dp))
            }
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)

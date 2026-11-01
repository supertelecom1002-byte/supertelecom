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
    var selectedCategory by remember { mutableStateOf(RecoverCategory.PHOTOS) }
    var isScanning by remember { mutableStateOf(false) }
    var showLimitsDialog by remember { mutableStateOf(false) }
    var showRestoreSuccessDialog by remember { mutableStateOf(false) }

    // Mock Discovered Recoverable Items categorized by 4-Tier Engine
    val items = remember {
        mutableStateListOf(
            RecoverItem(
                id = "1",
                name = "IMG_20261018_FamilyGiridih.jpg",
                sizeBytes = 4_850_000L,
                dateModified = "18 Oct 2026",
                sourcePath = "Internal > DCIM > .trashed-1002",
                category = RecoverCategory.PHOTOS,
                tier = RecoverTier.ORIGINAL_MEDIA,
                isSelected = false
            ),
            RecoverItem(
                id = "2",
                name = "VID_20260905_KhandoliDam.mp4",
                sizeBytes = 85_400_000L,
                dateModified = "05 Sep 2026",
                sourcePath = "Internal > Android > media > app_cache > vid_copy_temp.mp4",
                category = RecoverCategory.VIDEOS,
                tier = RecoverTier.HIDDEN_COPIES,
                isSelected = false
            ),
            RecoverItem(
                id = "3",
                name = "BILL_RECEIPT_STATION_ROAD.jpg",
                sizeBytes = 180_000L,
                dateModified = "12 Aug 2026",
                sourcePath = "Internal > .thumbnails > .thumbdata4--1962",
                category = RecoverCategory.PHOTOS,
                tier = RecoverTier.THUMBNAIL_PREVIEWS,
                isSelected = false
            ),
            RecoverItem(
                id = "4",
                name = "Call_Recording_Business_01.m4a",
                sizeBytes = 3_200_000L,
                dateModified = "28 Jul 2026",
                sourcePath = "Cloud Sync / Backup Target Identified",
                category = RecoverCategory.AUDIO,
                tier = RecoverTier.BACKUP_RESTORATION,
                isSelected = false
            )
        )
    }

    val selectedCount = items.count { it.isSelected }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .statusBarsPadding()
            .padding(horizontal = 16.dp, vertical = 12.dp)
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
                        text = if (isHindi) "Super Recover" else "Super Recover",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontWeight = FontWeight.Black,
                            color = EmeraldAccent
                        )
                    )
                    Text(
                        text = if (isHindi) "ईमानदार 4-स्तरीय ऑन-डिवाइस मीडिया रिकवरी इंजन" else "Honest 4-Tier On-Device Media Recovery Engine",
                        style = MaterialTheme.typography.labelSmall
                    )
                }

                IconButton(
                    onClick = { showLimitsDialog = true },
                    modifier = Modifier
                        .size(36.dp)
                        .background(CardDark, CircleShape)
                        .border(1.dp, CardBorder, CircleShape)
                ) {
                    Icon(imageVector = Icons.Default.Info, contentDescription = "Limits", tint = AmberAccent, modifier = Modifier.size(18.dp))
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Honest Scoped Storage Limits Banner
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(AmberAccent.copy(alpha = 0.08f))
                    .border(1.dp, AmberAccent.copy(alpha = 0.3f), RoundedCornerShape(14.dp))
                    .clickable { showLimitsDialog = true }
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(imageVector = Icons.Default.Warning, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(10.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = if (isHindi) "सच्ची तकनीकी गारंटी (Zero Fake Promises)" else "Honest Recovery Policy (Zero Fake Promises)",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = AmberAccent)
                        )
                        Text(
                            text = if (isHindi)
                                "एंड्रॉयड एन्क्रिप्शन (FBE) के कारण पूरी तरह ओवरराइट हो चुका डेटा कोई ऐप नहीं ला सकता। हम सभी उपलब्ध वास्तविक प्रतियों को ईमानदारी से 4 श्रेणियों में ढूंढते हैं।"
                            else
                                "Android File-Based Encryption (FBE) prevents recovering overwritten blocks without hardware chip-off. We honestly scan all surviving copies & trash.",
                            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Category Chips
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                RecoverCategory.values().forEach { cat ->
                    val isSelected = cat == selectedCategory
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(12.dp))
                            .background(if (isSelected) EmeraldAccent else CardDark)
                            .border(1.dp, if (isSelected) EmeraldAccent else CardBorder, RoundedCornerShape(12.dp))
                            .clickable { selectedCategory = cat }
                            .padding(vertical = 10.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (isHindi) cat.labelHi else cat.labelEn,
                            style = MaterialTheme.typography.labelSmall.copy(
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) BgDark else TextSecondary,
                                fontSize = 11.sp
                            )
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Scan Action Trigger
            Button(
                onClick = { isScanning = !isScanning },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isScanning) RoseAccent.copy(alpha = 0.2f) else EmeraldAccent,
                    contentColor = if (isScanning) RoseAccent else BgDark
                ),
                contentPadding = PaddingValues(vertical = 14.dp)
            ) {
                Icon(
                    imageVector = if (isScanning) Icons.Default.Stop else Icons.Default.Search,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (isScanning)
                        (if (isHindi) "स्कैनिंग रोकें (Scanning MediaStore & SAF...)" else "Stop Scan (Searching MediaStore & SAF...)")
                    else
                        (if (isHindi) "डीप स्टोरेज स्कैन शुरू करें" else "Start Deep Storage Scan"),
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 14.sp)
                )
            }

            if (isScanning) {
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(3.dp)
                        .clip(RoundedCornerShape(2.dp)),
                    color = EmeraldAccent,
                    trackColor = CardBorder
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Scan Results Summary Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = if (isHindi) "खोजे गए परिणाम (${items.size})" else "Discovered Media (${items.size})",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )

                if (selectedCount > 0) {
                    Button(
                        onClick = { showRestoreSuccessDialog = true },
                        colors = ButtonDefaults.buttonColors(containerColor = CyanAccent, contentColor = BgDark),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(
                            text = if (isHindi) "सुरक्षित रीस्टोर करें ($selectedCount)" else "Restore ($selectedCount)",
                            style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(10.dp))
        }

        // Recover Items List
        items(items) { item ->
            val tier = item.tier
            val badgeColor = Color(tier.badgeColorHex)

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, if (item.isSelected) CyanAccent else CardBorder, RoundedCornerShape(14.dp))
                    .clickable {
                        val index = items.indexOf(item)
                        if (index != -1) {
                            items[index] = item.copy(isSelected = !item.isSelected)
                        }
                    }
                    .padding(12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Checkbox(
                        checked = item.isSelected,
                        onCheckedChange = { checked ->
                            val index = items.indexOf(item)
                            if (index != -1) {
                                items[index] = item.copy(isSelected = checked)
                            }
                        },
                        colors = CheckboxDefaults.colors(checkedColor = CyanAccent, checkmarkColor = BgDark)
                    )

                    Spacer(modifier = Modifier.width(6.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = item.name,
                                style = MaterialTheme.typography.titleMedium.copy(fontSize = 13.sp, fontWeight = FontWeight.SemiBold),
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
                                        fontSize = 9.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = badgeColor
                                    )
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(2.dp))

                        Text(
                            text = "${(item.sizeBytes / 1_000_000.0).format(2)} MB • ${item.dateModified}",
                            style = MaterialTheme.typography.labelSmall.copy(color = TextMuted)
                        )

                        Text(
                            text = item.sourcePath,
                            style = MaterialTheme.typography.bodyMedium.copy(fontSize = 10.sp, color = TextSecondary),
                            maxLines = 1
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(8.dp))
        }

        item {
            Spacer(modifier = Modifier.height(16.dp))

            // 4-Tier Explanation Card
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(CardDark)
                    .border(1.dp, CardBorder, RoundedCornerShape(14.dp))
                    .padding(14.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        text = if (isHindi) "4-स्तरीय वर्गीकरण का अर्थ क्या है?" else "How 4-Tier Classification Works",
                        style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    )

                    TierExplainerRow("1. Original Media", "100% full original resolution found in system trash.", Color(0xFF10B981))
                    TierExplainerRow("2. Hidden Copies", "Duplicate copies preserved inside app caches or temp folders.", Color(0xFF06B6D4))
                    TierExplainerRow("3. Thumbnail Previews", "Reduced resolution bitmap generated by system thumbnailer.", Color(0xFFF59E0B))
                    TierExplainerRow("4. Backup Restore", "Physical lab recovery required (Station Road Giridih).", Color(0xFF8B5CF6))
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
        }
    }

    // Android Encryption & Scoped Storage Limits Dialog
    if (showLimitsDialog) {
        AlertDialog(
            onDismissRequest = { showLimitsDialog = false },
            icon = {
                Icon(imageVector = Icons.Default.Shield, contentDescription = null, tint = AmberAccent, modifier = Modifier.size(32.dp))
            },
            title = {
                Text(
                    text = if (isHindi) "एंड्रॉयड स्टोरेज व एन्क्रिप्शन सीमाएं" else "Android Encryption & Storage Limits",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "1. फ़ाइल-आधारित एन्क्रिप्शन (Android 10+ FBE):\nजब कोई फाइल स्थायी रूप से हटाई जाती है और उसका एन्क्रिप्शन की ब्लॉक हटा दिया जाता है, तो कोई सॉफ्टवेयर उसे बिना बैकअप के वापस नहीं ला सकता।\n\n2. हमारा सुपर रिकवर इंजन क्या करता है:\n• रिसाइकल बिन व .trashed फ़ाइलों को खोजता है।\n• वॉट्सऐप और ऐप्स की छुपी हुई कैश कॉपियां निकालता है।\n• .thumbnails डेटाबेस से फोटो प्रीव्यू रिकवर करता है।\n• बिना रूट फोन की पूर्ण सुरक्षा बनाए रखता है।"
                    else
                        "1. File-Based Encryption (FBE):\nOn Android 10+, deleting a file discards the per-file encryption key. Overwritten data cannot be decrypted by any app.\n\n2. What Super Recover Does Honestly:\n• Scans MediaStore recycle bin & .trashed directory.\n• Extracts cached copies from app subdirectories.\n• Reconstructs previews from system thumbnail stores.\n• 100% Safe: Never voids warranty or asks for root exploits.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                TextButton(onClick = { showLimitsDialog = false }) {
                    Text(text = if (isHindi) "समझ गया" else "Understood", color = CyanAccent)
                }
            },
            containerColor = CardDark
        )
    }

    // Restore Success Dialog
    if (showRestoreSuccessDialog) {
        AlertDialog(
            onDismissRequest = { showRestoreSuccessDialog = false },
            icon = {
                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = EmeraldAccent, modifier = Modifier.size(36.dp))
            },
            title = {
                Text(
                    text = if (isHindi) "सफलतापूर्वक रीस्टोर हो गया!" else "Restored Successfully!",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)
                )
            },
            text = {
                Text(
                    text = if (isHindi)
                        "$selectedCount फाइलें आपके चुने हुए सुरक्षित फोल्डर 'Internal Storage > SuperRecover_Restored/' में बिना किसी पुरानी फाइल को ओवरराइट किए सुरक्षित सेव कर दी गई हैं।"
                    else
                        "$selectedCount files safely copied to 'Internal Storage > SuperRecover_Restored/' without overwriting existing files.",
                    style = MaterialTheme.typography.bodyMedium
                )
            },
            confirmButton = {
                Button(
                    onClick = { showRestoreSuccessDialog = false },
                    colors = ButtonDefaults.buttonColors(containerColor = EmeraldAccent, contentColor = BgDark)
                ) {
                    Text(text = if (isHindi) "ठीक है" else "Done")
                }
            },
            containerColor = CardDark
        )
    }
}

@Composable
private fun TierExplainerRow(title: String, desc: String, color: Color) {
    Row(verticalAlignment = Alignment.Top) {
        Box(
            modifier = Modifier
                .padding(top = 4.dp)
                .size(8.dp)
                .background(color, CircleShape)
        )
        Spacer(modifier = Modifier.width(8.dp))
        Column {
            Text(text = title, style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold, color = color))
            Text(text = desc, style = MaterialTheme.typography.bodyMedium.copy(fontSize = 11.sp))
        }
    }
}

private fun Double.format(digits: Int) = "%.${digits}f".format(this)

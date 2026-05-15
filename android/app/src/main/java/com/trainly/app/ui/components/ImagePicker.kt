package com.trainly.app.ui.components

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.trainly.app.utils.saveBitmapToTempFile

@Composable
fun rememberImagePicker(onPick: (Uri) -> Unit): ImagePickerState {
    val ctx = LocalContext.current
    val show = remember { mutableStateOf(false) }
    val cam = rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()) {
        it?.let { b -> saveBitmapToTempFile(ctx, b).let(onPick) }
        show.value = false
    }
    val gal = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) {
        it?.let(onPick)
        show.value = false
    }
    return ImagePickerState(show, { cam.launch(null) }, { gal.launch("image/*") }, { show.value = true }, { show.value = false })
}

data class ImagePickerState(
    val show: MutableState<Boolean>,
    val camera: () -> Unit,
    val gallery: () -> Unit,
    val open: () -> Unit,
    val dismiss: () -> Unit
) {
    @Composable
    fun DialogContent() {
        if (show.value) {
            AlertDialog(
                onDismissRequest = dismiss,
                title = { Text("Choose Source") },
                text = {
                    Column {
                        Button(onClick = camera, modifier = Modifier.fillMaxWidth()) { Text("Camera") }
                        Spacer(Modifier.height(8.dp))
                        Button(onClick = gallery, modifier = Modifier.fillMaxWidth()) { Text("Gallery") }
                    }
                },
                confirmButton = {}
            )
        }
    }
}

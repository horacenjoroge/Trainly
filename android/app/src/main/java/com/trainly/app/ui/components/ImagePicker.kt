package com.trainly.app.ui.components
import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable fun rememberImagePicker(onPick:(Uri)->Unit): ImagePickerState {
    val show=remember{mutableStateOf(false)}
    val cam=rememberLauncherForActivityResult(ActivityResultContracts.TakePicturePreview()){ it?.let{b-> onPick(com.trainly.app.utils.saveBitmapToTempFile(androidx.compose.ui.platform.LocalContext.current, b)) }; show.value=false }
    val gal=rememberLauncherForActivityResult(ActivityResultContracts.GetContent()){ it?.let(onPick); show.value=false }
    return ImagePickerState(show, { cam.launch(null) }, { gal.launch("image/*") }, { show.value=true }, { show.value=false })
}
data class ImagePickerState(val show:MutableState<Boolean>, val camera:()->Unit, val gallery:()->Unit, val open:()->Unit, val dismiss:()->Unit) {
    @Composable fun Dialog() { if(show.value) AlertDialog(onDismissRequest=dismiss, title={Text("Choose Source")}, text={Column { Button(onClick=camera, Modifier.fillMaxWidth()){Text("📷 Camera")}; Spacer(Modifier.height(8.dp)); Button(onClick=gallery, Modifier.fillMaxWidth()){Text("🖼 Gallery")} } }, confirmButton={}) }
}

package com.trainly.app.ui.components
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

enum class AppBtnVariant { Primary, Secondary, Outlined, Error }
@Composable fun AppButton(text:String, onClick:()->Unit, mod:Modifier=Modifier, enabled:Boolean=true, loading:Boolean=false, variant:AppBtnVariant=AppBtnVariant.Primary) {
    val c = when(variant) { AppBtnVariant.Primary -> ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.primary)
        AppBtnVariant.Error -> ButtonDefaults.buttonColors(containerColor=MaterialTheme.colorScheme.error); else -> ButtonDefaults.outlinedButtonColors() }
    val b = @Composable { if(loading) CircularProgressIndicator(Modifier, strokeWidth=2.dp) else Text(text, fontWeight=FontWeight.SemiBold) }
    if(variant==AppBtnVariant.Outlined) OutlinedButton(onClick, mod.height(48.dp), enabled=enabled&&!loading, shape=RoundedCornerShape(12.dp)) { b() }
    else Button(onClick, mod.height(48.dp), enabled=enabled&&!loading, colors=c, shape=RoundedCornerShape(12.dp)) { b() }
}

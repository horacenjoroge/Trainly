package com.trainly.app.ui.components
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable fun AppTextField(value:String, onValueChange:(String)->Unit, label:String, mod:Modifier=Modifier, leadingIcon:@Composable (()->Unit)?=null, trailingIcon:@Composable (()->Unit)?=null, singleLine:Boolean=true, error:String?=null) {
    OutlinedTextField(value, onValueChange, label={Text(label)}, leadingIcon=leadingIcon, trailingIcon=trailingIcon, modifier=mod, shape=RoundedCornerShape(12.dp), singleLine=singleLine, isError=error!=null, supportingText=error?.let{{Text(it)}})
}

package com.trainly.app.ui.components.gym
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog

@Composable fun WeightModal(visible:Boolean, name:String, idx:Int, weight:String, reps:String, rest:Int, onClose:()->Unit, onW:(String)->Unit, onR:(String)->Unit, onRest:(Int)->Unit, onSave:()->Unit) {
    if(!visible)return; val opts=listOf(30 to "30s", 60 to "1m", 90 to "1m30s", 120 to "2m")
    Dialog(onDismissRequest=onClose) { Surface(RoundedCornerShape(16.dp), color=MaterialTheme.colorScheme.surface, tonalElevation=8.dp) { Column(Modifier.padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("$name - Set ${idx+1}", fontWeight=FontWeight.Bold); Spacer(Modifier.height(16.dp)); OutlinedTextField(weight, onW, label={Text("Weight (kg)")}, keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Number), modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(8.dp)); OutlinedTextField(reps, onR, label={Text("Reps")}, keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Number), modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(12.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.spacedBy(8.dp)) { opts.forEach{(v,l)-> FilterChip(rest==v,{onRest(v)},label={Text(l)}, modifier=Modifier.weight(1f)) } }; Spacer(Modifier.height(16.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.spacedBy(12.dp)) { OutlinedButton(onClick=onClose, Modifier.weight(1f)){Text("Cancel")}; Button(onClick=onSave, Modifier.weight(1f)){Text("Save")} } } } }
}

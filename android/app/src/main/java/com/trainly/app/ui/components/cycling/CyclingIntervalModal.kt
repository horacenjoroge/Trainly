package com.trainly.app.ui.components.cycling
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

data class IntervalType(val value:String, val label:String, val color:Long=0xFFE57C0B)
@Composable fun CyclingIntervalModal(visible:Boolean, type:String, dur:String, power:String, types:List<IntervalType>, onClose:()->Unit, onType:(String)->Unit, onDur:(String)->Unit, onPower:(String)->Unit, onStart:()->Unit) {
    if(!visible)return; Dialog(onDismissRequest=onClose) { Surface(RoundedCornerShape(16.dp), color=MaterialTheme.colorScheme.surface, tonalElevation=8.dp) { Column(Modifier.padding(24.dp), horizontalAlignment=Alignment.CenterHorizontally) { Text("Start Interval", fontWeight=FontWeight.Bold); Spacer(Modifier.height(16.dp)); types.forEach{ FilterChip(type==it.value, {onType(it.value)}, label={Text(it.label)}) }; Spacer(Modifier.height(12.dp)); OutlinedTextField(dur, onDur, label={Text("Duration (sec)")}, keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Number), modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(8.dp)); OutlinedTextField(power, onPower, label={Text("Target Power")}, keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.Number), modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(16.dp)); Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.spacedBy(12.dp)) { OutlinedButton(onClick=onClose, Modifier.weight(1f)){Text("Cancel")}; Button(onClick=onStart, Modifier.weight(1f)){Text("Start")} } } } }
}

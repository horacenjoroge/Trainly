package com.trainly.app.ui.screens.training
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.components.TrainHeader
import com.trainly.app.viewmodel.TrackingViewModel

data class GymExercise(val name:String, val muscleGroup:String, val sets:MutableList<GymSet> = mutableListOf())
data class GymSet(val reps:Int, val weight:Double)

@OptIn(ExperimentalMaterial3Api::class)
@Composable fun GymWorkoutScreen(onBack:()->Unit, vm:TrackingViewModel= hiltViewModel()) {
    val s by vm.uiState.collectAsStateWithLifecycle(); var ex by remember{mutableStateOf<List<GymExercise>>(emptyList())}; var show by remember{mutableStateOf(false)}
    LaunchedEffect(Unit){vm.initialize("Gym")}
    Scaffold(topBar={TrainHeader("Gym Workout", s.durationSeconds, s.isPaused, onBack)}, floatingActionButton={FloatingActionButton(onClick={show=true}, containerColor=MaterialTheme.colorScheme.primary){Text("+")}}){p->
        if(ex.isEmpty()) Box(Modifier.fillMaxSize().padding(p), contentAlignment=Alignment.Center) { Column(horizontalAlignment=Alignment.CenterHorizontally) { Text("🏋️", style=MaterialTheme.typography.displayLarge); Text("Add exercises") } }
        else LazyColumn(Modifier.fillMaxSize().padding(p), contentPadding=PaddingValues(16.dp), verticalArrangement=Arrangement.spacedBy(12.dp)) {
            items(ex) { e-> Card(shape=RoundedCornerShape(12.dp), colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.surface)) { Column(Modifier.padding(16.dp)) { Text(e.name, fontWeight=FontWeight.Bold); Text(e.muscleGroup, style=MaterialTheme.typography.bodySmall); e.sets.forEachIndexed{i,st-> Text("Set ${i+1}: ${st.reps} reps @ ${st.weight}kg", style=MaterialTheme.typography.bodySmall) }; Spacer(Modifier.height(8.dp)); OutlinedButton(onClick={}, Modifier.fillMaxWidth()){Text("+ Add Set")} } } }
        }
    }
    if(show) { var n by remember{mutableStateOf("")}; var g by remember{mutableStateOf("Chest")}; AlertDialog(onDismissRequest={show=false}, title={Text("Add Exercise")}, text={Column { OutlinedTextField(n, {n=it}, label={Text("Name")}, modifier=Modifier.fillMaxWidth()); Spacer(Modifier.height(8.dp)); listOf("Chest","Back","Legs").forEach{ FilterChip(g==it,{g=it},label={Text(it)}) } } }, confirmButton={Button(onClick={ ex=ex+GymExercise(n,g); show=false }, enabled=n.isNotBlank()){Text("Add")} }) }
}

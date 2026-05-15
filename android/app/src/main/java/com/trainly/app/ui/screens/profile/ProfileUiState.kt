package com.trainly.app.ui.screens.profile
sealed class ProfileUiState { data object Loading: ProfileUiState()
    data class Success(val userName:String="User", val userBio:String="Fitness enthusiast", val avatar:String?=null, val followers:Int=0, val following:Int=0, val stats:ProfileStatsData=ProfileStatsData(), val isUploading:Boolean=false): ProfileUiState()
    data class Error(val message:String, val userName:String="User"): ProfileUiState()
}
data class ProfileStatsData(val workouts:Int=0, val hours:Int=0, val calories:Int=0)

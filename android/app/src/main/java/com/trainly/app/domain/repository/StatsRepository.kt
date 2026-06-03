package com.trainly.app.domain.repository
import com.trainly.app.data.remote.NetworkResult
import com.trainly.app.domain.models.ProgressStats
interface StatsRepository {
    suspend fun getStats(period: String): NetworkResult<ProgressStats>
    suspend fun getAchievements(): NetworkResult<List<Achievement>>
}
data class Achievement(val id: String="", val name: String="", val description: String="", val icon: String="🏆", val category: String="", val points: Int=10, val earnedAt: String?=null)

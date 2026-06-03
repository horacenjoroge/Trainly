package com.trainly.app.ui.features.auth

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.trainly.app.ui.designsystem.components.feedback.TrainlyErrorBanner
import com.trainly.app.ui.designsystem.layouts.TopBarStyle
import com.trainly.app.ui.designsystem.layouts.TrainlyScaffold
import com.trainly.app.ui.designsystem.theme.Spacing
import com.trainly.app.ui.designsystem.theme.TrainlyTheme
import com.trainly.app.ui.features.auth.AuthFormEvent
import com.trainly.app.ui.features.auth.AuthUiState
import com.trainly.app.viewmodel.AuthViewModel

private val AuthBg = Color(0xFFFBFBF9)
private val AuthFg = Color(0xFF1C293C)
private val AuthMuted = Color(0xFF5A6B7E)
private val AuthAccent = Color(0xFFFDC800)
private val AuthSuccess = Color(0xFF16A34A)
private val AuthBorderWidth = 3.dp
private val AuthShadowOffset = 4.dp
private val AuthBtnShadowOffset = 6.dp
private val AuthChipShadowOffset = 2.dp

@Composable
fun RegisterScreen(
    onLogin: () -> Unit,
    onSuccess: () -> Unit,
    vm: AuthViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    val form = state as? AuthUiState.RegisterForm
    var currentStep by remember { mutableIntStateOf(1) }

    var selectedSports by remember { mutableStateOf(setOf("Running", "Strength")) }
    var experienceLevel by remember { mutableStateOf("Intermediate") }
    var location by remember { mutableStateOf("") }
    var primaryGoal by remember { mutableStateOf(setOf("Improve Fitness", "Build Strength")) }
    var weeklyTarget by remember { mutableStateOf("4-5 per week") }
    var height by remember { mutableStateOf("") }
    var weight by remember { mutableStateOf("") }

    LaunchedEffect(Unit) { vm.setRegisterForm() }
    LaunchedEffect(Unit) {
        vm.events.collect { event ->
            when (event) {
                is AuthFormEvent.RegisterSuccess -> onSuccess()
                else -> {}
            }
        }
    }

    TrainlyScaffold(
        topBarTitle = "Create Account",
        topBarIcon = if (currentStep > 1) ({ Text("\u2190", fontWeight = FontWeight.Bold, color = AuthFg) }) else null,
        topBarIconContentDescription = if (currentStep > 1) "Go back" else null,
        onTopBarIconClick = if (currentStep > 1) ({ currentStep-- }) else null,
        topBarStyle = TopBarStyle.DEFAULT
    ) { padding ->
        Column(
            modifier = Modifier
                .padding(padding)
                .padding(horizontal = Spacing.xl)
                .fillMaxWidth()
                .background(AuthBg),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            StepIndicator(currentStep = currentStep, totalSteps = 3)

            form?.error?.let { error ->
                TrainlyErrorBanner(message = error)
            }

            when (currentStep) {
                1 -> AccountStep(
                    name = form?.name ?: "",
                    email = form?.email ?: "",
                    password = form?.password ?: "",
                    isLoading = form?.isLoading == true,
                    onNameChange = { vm.updateRegisterName(it) },
                    onEmailChange = { vm.updateRegisterEmail(it) },
                    onPasswordChange = { vm.updateRegisterPassword(it) },
                    onNext = {
                        if (form?.name?.isNotBlank() == true && form?.email?.isNotBlank() == true && form?.password?.length ?: 0 >= 8) {
                            currentStep = 2
                        }
                    }
                )
                2 -> ProfileStep(
                    selectedSports = selectedSports,
                    experienceLevel = experienceLevel,
                    location = location,
                    onSportToggle = { sport ->
                        selectedSports = if (sport in selectedSports) selectedSports - sport else selectedSports + sport
                    },
                    onLevelSelect = { experienceLevel = it },
                    onLocationChange = { location = it },
                    onNext = { currentStep = 3 }
                )
                3 -> GoalsStep(
                    primaryGoal = primaryGoal,
                    weeklyTarget = weeklyTarget,
                    height = height,
                    weight = weight,
                    onGoalToggle = { goal ->
                        primaryGoal = if (goal in primaryGoal) primaryGoal - goal else primaryGoal + goal
                    },
                    onWeeklyTargetChange = { weeklyTarget = it },
                    onHeightChange = { height = it },
                    onWeightChange = { weight = it },
                    onSubmit = { vm.register() },
                    isSubmitting = form?.isLoading == true
                )
            }

            AuthLink(
                text = "Already have an account? ",
                linkText = "Log in",
                onClick = onLogin
            )
        }
    }
}

@Composable
private fun StepIndicator(
    currentStep: Int,
    totalSteps: Int
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = Spacing.sm),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (i in 1..totalSteps) {
            val isCompleted = i < currentStep
            val isActive = i == currentStep

            Box(modifier = Modifier.size(36.dp)) {
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .offset(x = AuthChipShadowOffset, y = AuthChipShadowOffset)
                        .background(AuthFg, RoundedCornerShape(2.dp))
                )
                Box(
                    modifier = Modifier
                        .matchParentSize()
                        .background(
                            when {
                                isCompleted -> AuthSuccess
                                isActive -> AuthAccent
                                else -> AuthBg
                            },
                            RoundedCornerShape(2.dp)
                        )
                        .borderExtra(AuthBorderWidth, AuthFg),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isCompleted) "\u2713" else "$i",
                        fontWeight = FontWeight.Black,
                        fontSize = 13.sp,
                        color = when {
                            isCompleted -> androidx.compose.ui.graphics.Color.White
                            isActive -> AuthFg
                            else -> AuthMuted
                        }
                    )
                }
            }

            if (i < totalSteps) {
                Box(
                    modifier = Modifier
                        .width(24.dp)
                        .height(3.dp)
                        .background(AuthFg)
                )
            }
        }
    }
}

@Composable
private fun AccountStep(
    name: String,
    email: String,
    password: String,
    isLoading: Boolean,
    onNameChange: (String) -> Unit,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onNext: () -> Unit
) {
    var showPassword by remember { mutableStateOf(false) }

    Column(verticalArrangement = Arrangement.spacedBy(Spacing.md)) {
        Column {
            Text(
                text = "Create account",
                fontWeight = FontWeight.Black,
                fontSize = 27.sp,
                color = AuthFg
            )
            Text(
                text = "Set up your login credentials.",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = AuthMuted
            )
        }
        InputGroup(label = "Full Name") {
            AuthInput(
                value = name,
                onValueChange = onNameChange,
                placeholder = "Alex Johnson",
                prefixIcon = { UserIcon() }
            )
        }
        InputGroup(label = "Email") {
            AuthInput(
                value = email,
                onValueChange = onEmailChange,
                placeholder = "you@example.com",
                prefixIcon = { MailIcon() }
            )
        }
        InputGroup(label = "Password") {
            AuthInput(
                value = password,
                onValueChange = onPasswordChange,
                placeholder = "At least 8 characters",
                isPassword = !showPassword,
                prefixIcon = { LockIcon() },
                suffixIcon = {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clickable { showPassword = !showPassword },
                        contentAlignment = Alignment.Center
                    ) {
                        if (showPassword) EyeOffIcon() else EyeIcon()
                    }
                }
            )
            Text(
                text = "At least 8 characters",
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium,
                color = AuthMuted
            )
        }
        AuthButton(
            text = "Create Account \u2192",
            onClick = onNext,
            isLoading = isLoading
        )
    }
}

@Composable
private fun ProfileStep(
    selectedSports: Set<String>,
    experienceLevel: String,
    location: String,
    onSportToggle: (String) -> Unit,
    onLevelSelect: (String) -> Unit,
    onLocationChange: (String) -> Unit,
    onNext: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(Spacing.md)) {
        Column {
            Text(
                text = "Your profile",
                fontWeight = FontWeight.Black,
                fontSize = 27.sp,
                color = AuthFg
            )
            Text(
                text = "Tell us about your fitness background.",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = AuthMuted
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
            InputLabel("Your Sports")
            Row(horizontalArrangement = Arrangement.spacedBy(Spacing.sm)) {
                listOf("Running", "Cycling", "Swimming").forEach { sport ->
                    AuthChip(
                        selected = sport in selectedSports,
                        onClick = { onSportToggle(sport) },
                        text = sport
                    )
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(Spacing.sm)) {
                listOf("Strength", "Yoga", "Hiking").forEach { sport ->
                    AuthChip(
                        selected = sport in selectedSports,
                        onClick = { onSportToggle(sport) },
                        text = sport
                    )
                }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
            InputLabel("Experience Level")
            Row(horizontalArrangement = Arrangement.spacedBy(Spacing.sm)) {
                listOf("Beginner", "Intermediate", "Advanced", "Athlete").forEach { level ->
                    AuthChip(
                        selected = experienceLevel == level,
                        onClick = { onLevelSelect(level) },
                        text = level
                    )
                }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
            InputLabel("Location")
            AuthInput(
                value = location,
                onValueChange = onLocationChange,
                placeholder = "City, Country"
            )
        }
        AuthButton(text = "Continue \u2192", onClick = onNext)
    }
}

@Composable
private fun GoalsStep(
    primaryGoal: Set<String>,
    weeklyTarget: String,
    height: String,
    weight: String,
    onGoalToggle: (String) -> Unit,
    onWeeklyTargetChange: (String) -> Unit,
    onHeightChange: (String) -> Unit,
    onWeightChange: (String) -> Unit,
    onSubmit: () -> Unit,
    isSubmitting: Boolean
) {
    Column(verticalArrangement = Arrangement.spacedBy(Spacing.md)) {
        Column {
            Text(
                text = "Your goals",
                fontWeight = FontWeight.Black,
                fontSize = 27.sp,
                color = AuthFg
            )
            Text(
                text = "What do you want to achieve?",
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = AuthMuted
            )
        }
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
            InputLabel("Primary Goal")
            Row(horizontalArrangement = Arrangement.spacedBy(Spacing.sm)) {
                listOf("Improve Fitness", "Lose Weight", "Build Strength").forEach { goal ->
                    AuthChip(
                        selected = goal in primaryGoal,
                        onClick = { onGoalToggle(goal) },
                        text = goal
                    )
                }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(Spacing.sm)) {
                listOf("Race Training", "General Health").forEach { goal ->
                    AuthChip(
                        selected = goal in primaryGoal,
                        onClick = { onGoalToggle(goal) },
                        text = goal
                    )
                }
            }
        }
        Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
            InputLabel("Weekly Workouts Target")
            AuthInput(
                value = weeklyTarget,
                onValueChange = onWeeklyTargetChange,
                placeholder = "4-5 per week"
            )
        }
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(Spacing.md)
        ) {
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                InputLabel("Height (cm)")
                AuthInput(
                    value = height,
                    onValueChange = onHeightChange,
                    placeholder = "175"
                )
            }
            Column(
                modifier = Modifier.weight(1f),
                verticalArrangement = Arrangement.spacedBy(Spacing.sm)
            ) {
                InputLabel("Weight (kg)")
                AuthInput(
                    value = weight,
                    onValueChange = onWeightChange,
                    placeholder = "70"
                )
            }
        }
        AuthButton(
            text = "Start Training \u2192",
            onClick = onSubmit,
            isLoading = isSubmitting
        )
    }
}

@Composable
private fun InputGroup(
    label: String,
    content: @Composable () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
        InputLabel(label)
        content()
    }
}

@Composable
private fun InputLabel(text: String) {
    Text(
        text = text.uppercase(),
        fontSize = 13.sp,
        fontWeight = FontWeight.Black,
        color = AuthFg
    )
}

@Composable
private fun AuthInput(
    value: String,
    onValueChange: (String) -> Unit,
    placeholder: String = "",
    isPassword: Boolean = false,
    prefixIcon: @Composable (() -> Unit)? = null,
    suffixIcon: @Composable (() -> Unit)? = null
) {
    val visualTransformation = if (isPassword) PasswordVisualTransformation()
        else VisualTransformation.None

    Box {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .offset(x = AuthShadowOffset, y = AuthShadowOffset)
                .background(AuthFg, RoundedCornerShape(2.dp))
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp)
                .background(AuthBg, RoundedCornerShape(2.dp))
                .borderExtra(AuthBorderWidth, AuthFg),
            verticalAlignment = Alignment.CenterVertically
        ) {
            if (prefixIcon != null) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .drawRightBorder(),
                    contentAlignment = Alignment.Center
                ) {
                    prefixIcon()
                }
            }
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                visualTransformation = visualTransformation,
                textStyle = TextStyle(
                    fontSize = 15.sp,
                    color = AuthFg,
                    fontFamily = MaterialTheme.typography.bodyLarge.fontFamily
                ),
                cursorBrush = SolidColor(AuthFg),
                decorationBox = { innerTextField ->
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        contentAlignment = Alignment.CenterStart
                    ) {
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder,
                                fontSize = 15.sp,
                                color = AuthMuted.copy(alpha = 0.5f)
                            )
                        }
                        innerTextField()
                    }
                },
                modifier = Modifier.weight(1f)
            )
            if (suffixIcon != null) {
                suffixIcon()
            }
        }
    }
}

@Composable
private fun UserIcon() {
    val color = AuthMuted
    Canvas(modifier = Modifier.size(24.dp)) {
        val s = Stroke(3f, cap = StrokeCap.Square, join = StrokeJoin.Miter)
        val sc = size.width / 24f
        drawCircle(color, radius = 4f * sc, center = Offset(12f * sc, 8f * sc), style = s)
        val body = Path().apply {
            moveTo(4f * sc, 21f * sc)
            lineTo(4f * sc, 19f * sc)
            arcTo(Rect(4f * sc, 11f * sc, 20f * sc, 19f * sc), 180f, 180f, false)
            lineTo(20f * sc, 21f * sc)
        }
        drawPath(body, color, style = s)
    }
}

@Composable
private fun MailIcon() {
    val color = AuthMuted
    Canvas(modifier = Modifier.size(24.dp)) {
        val s = Stroke(3f, cap = StrokeCap.Square, join = StrokeJoin.Miter)
        val sc = size.width / 24f
        drawRoundRect(color, Offset(3f * sc, 5f * sc), Size(18f * sc, 14f * sc),
            CornerRadius(2f * sc, 2f * sc), style = s)
        val flap = Path().apply {
            moveTo(3f * sc, 7f * sc)
            lineTo(12f * sc, 13f * sc)
            lineTo(21f * sc, 7f * sc)
        }
        drawPath(flap, color, style = s)
    }
}

@Composable
private fun LockIcon() {
    val color = AuthMuted
    Canvas(modifier = Modifier.size(24.dp)) {
        val s = Stroke(3f, cap = StrokeCap.Square, join = StrokeJoin.Miter)
        val sc = size.width / 24f
        drawRoundRect(color, Offset(5f * sc, 11f * sc), Size(14f * sc, 10f * sc),
            CornerRadius(1f * sc, 1f * sc), style = s)
        val shackle = Path().apply {
            moveTo(8f * sc, 11f * sc)
            lineTo(8f * sc, 7f * sc)
            arcTo(Rect(8f * sc, 3f * sc, 16f * sc, 11f * sc), 180f, 180f, false)
            lineTo(16f * sc, 11f * sc)
        }
        drawPath(shackle, color, style = s)
    }
}

@Composable
private fun EyeIcon() {
    val color = AuthMuted
    Canvas(modifier = Modifier.size(24.dp)) {
        val s = Stroke(width = 3f, cap = StrokeCap.Square, join = StrokeJoin.Miter)
        val p = Path().apply {
            moveTo(2f, size.height / 2f)
            cubicTo(2f, size.height * 0.2f, size.width - 2f, size.height * 0.2f, size.width - 2f, size.height / 2f)
            cubicTo(size.width - 2f, size.height * 0.8f, 2f, size.height * 0.8f, 2f, size.height / 2f)
        }
        drawPath(p, color, style = s)
        drawCircle(color, radius = 3f, center = Offset(size.width / 2f, size.height / 2f), style = s)
    }
}

@Composable
private fun EyeOffIcon() {
    val color = AuthMuted
    Canvas(modifier = Modifier.size(24.dp)) {
        val s = Stroke(width = 3f, cap = StrokeCap.Square, join = StrokeJoin.Miter)
        drawLine(color, Offset(2f, 2f), Offset(size.width - 2f, size.height - 2f), strokeWidth = 3f, cap = StrokeCap.Square)
        val p = Path().apply {
            moveTo(4f, size.height / 2f)
            cubicTo(4f, size.height * 0.25f, size.width - 4f, size.height * 0.25f, size.width - 4f, size.height / 2f)
            cubicTo(size.width - 4f, size.height * 0.75f, 4f, size.height * 0.75f, 4f, size.height / 2f)
        }
        drawPath(p, color, style = s)
    }
}

@Composable
private fun AuthButton(
    text: String,
    onClick: () -> Unit,
    isLoading: Boolean = false
) {
    Box(modifier = Modifier.fillMaxWidth().clickable(enabled = !isLoading) { onClick() }) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .offset(x = AuthBtnShadowOffset, y = AuthBtnShadowOffset)
                .background(AuthFg, RoundedCornerShape(2.dp))
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp)
                .background(AuthAccent, RoundedCornerShape(2.dp))
                .borderExtra(AuthBorderWidth, AuthFg),
            contentAlignment = Alignment.Center
        ) {
            if (isLoading) {
                Box(
                    modifier = Modifier
                        .size(20.dp)
                        .border(3.dp, AuthFg, RoundedCornerShape(10.dp))
                )
            } else {
                Text(
                    text = text,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    color = AuthFg
                )
            }
        }
    }
}

@Composable
private fun AuthChip(
    selected: Boolean,
    onClick: () -> Unit,
    text: String
) {
    Box(modifier = Modifier.clickable { onClick() }) {
        Box(
            modifier = Modifier
                .matchParentSize()
                .offset(x = AuthChipShadowOffset, y = AuthChipShadowOffset)
                .background(AuthFg, RoundedCornerShape(2.dp))
        )
        Box(
            modifier = Modifier
                .background(
                    if (selected) AuthAccent else AuthBg,
                    RoundedCornerShape(2.dp)
                )
                .borderExtra(AuthBorderWidth, AuthFg)
                .padding(horizontal = 12.dp, vertical = 4.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = text,
                fontSize = 13.sp,
                fontWeight = FontWeight.Black,
                color = AuthFg
            )
        }
    }
}

@Composable
private fun AuthLink(
    text: String,
    linkText: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = Spacing.sm),
        horizontalArrangement = Arrangement.Center
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = AuthMuted,
            textAlign = TextAlign.Center
        )
        Text(
            text = linkText,
            fontSize = 13.sp,
            fontWeight = FontWeight.Black,
            color = AuthFg,
            textAlign = TextAlign.Center,
            modifier = Modifier.clickable { onClick() }.then(
                Modifier.drawWithContent {
                    drawContent()
                    val h = size.height
                    drawLine(
                        color = AuthAccent,
                        start = Offset(0f, h),
                        end = Offset(size.width, h),
                        strokeWidth = 2.dp.toPx(),
                        cap = StrokeCap.Square
                    )
                }
            )
        )
    }
}

private fun Modifier.drawRightBorder(): Modifier = this.then(
    Modifier.drawWithContent {
        drawContent()
        drawLine(
            color = AuthFg,
            start = Offset(size.width, 0f),
            end = Offset(size.width, size.height),
            strokeWidth = AuthBorderWidth.toPx(),
            cap = StrokeCap.Square
        )
    }
)

private fun Modifier.borderExtra(
    width: androidx.compose.ui.unit.Dp = AuthBorderWidth,
    color: Color = AuthFg,
    shape: androidx.compose.ui.graphics.Shape = RoundedCornerShape(2.dp)
): Modifier = this.then(border(width, color, shape))

@Preview
@Composable
private fun RegisterScreenPreview() {
    TrainlyTheme {
        RegisterScreen(
            onLogin = {},
            onSuccess = {}
        )
    }
}

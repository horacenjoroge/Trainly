package com.trainly.app.ui.features.auth

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
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
private val AuthBorderWidth = 3.dp
private val AuthShadowOffset = 4.dp
private val AuthBtnShadowOffset = 6.dp

@Composable
fun LoginScreen(
    onRegister: () -> Unit,
    onForgotPassword: () -> Unit = {},
    onSuccess: () -> Unit,
    vm: AuthViewModel = hiltViewModel()
) {
    val state by vm.uiState.collectAsStateWithLifecycle()
    val form = state as? AuthUiState.LoginForm

    LaunchedEffect(Unit) { vm.setLoginForm() }
    LaunchedEffect(Unit) {
        vm.events.collect { event ->
            when (event) {
                is AuthFormEvent.LoginSuccess -> onSuccess()
                else -> {}
            }
        }
    }

    TrainlyScaffold(
        topBarStyle = TopBarStyle.NONE,
        topBarTitle = null,
        bottomBar = {}
    ) { _ ->
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(AuthBg)
                .padding(horizontal = Spacing.xl, vertical = Spacing.xl),
            verticalArrangement = Arrangement.spacedBy(Spacing.lg)
        ) {
            Spacer(Modifier.height(Spacing.xl))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    modifier = Modifier
                        .size(32.dp)
                        .background(AuthAccent, RoundedCornerShape(2.dp))
                        .borderExtra(AuthBorderWidth, AuthFg)
                )
                Spacer(Modifier.width(Spacing.sm))
                Text(
                    text = "Trainly",
                    fontWeight = FontWeight.Black,
                    style = MaterialTheme.typography.titleLarge,
                    color = AuthFg
                )
            }

            Column {
                Text(
                    text = "Welcome back",
                    fontWeight = FontWeight.Black,
                    fontSize = 27.sp,
                    color = AuthFg
                )
                Text(
                    text = "Log in to continue your training.",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = AuthMuted
                )
            }

            form?.error?.let { error ->
                TrainlyErrorBanner(message = error)
            }

            InputGroup(label = "Email") {
                AuthInput(
                    value = form?.email ?: "",
                    onValueChange = { vm.updateLoginEmail(it) },
                    placeholder = "you@example.com",
                    prefixIcon = { MailIcon() }
                )
            }

            InputGroup(label = "Password") {
                AuthInput(
                    value = form?.password ?: "",
                    onValueChange = { vm.updateLoginPassword(it) },
                    placeholder = "Enter password",
                    isPassword = !(form?.showPassword == true),
                    prefixIcon = { LockIcon() },
                    suffixIcon = {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clickable { vm.toggleLoginPasswordVisibility() },
                            contentAlignment = Alignment.Center
                        ) {
                            if (form?.showPassword == true) EyeOffIcon() else EyeIcon()
                        }
                    }
                )
            }

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End
            ) {
                Text(
                    text = "Forgot password?",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = AuthMuted,
                    modifier = Modifier.clickable { onForgotPassword() }
                )
            }

            AuthButton(
                text = if (form?.isLoading == true) "" else "Log In",
                onClick = { vm.login() },
                isLoading = form?.isLoading == true
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                HorizontalDivider(
                    modifier = Modifier.weight(1f),
                    thickness = 2.dp,
                    color = AuthFg
                )
                Text(
                    text = "or continue with",
                    modifier = Modifier.padding(horizontal = Spacing.md),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = AuthMuted
                )
                HorizontalDivider(
                    modifier = Modifier.weight(1f),
                    thickness = 2.dp,
                    color = AuthFg
                )
            }

            SocialButton(
                text = "Google",
                onClick = { /* TODO: vm.loginWithGoogle() */ },
                modifier = Modifier.fillMaxWidth(),
                icon = { GoogleIcon() }
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "Don't have an account? ",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = AuthMuted
                )
                Text(
                    text = "Create one",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    color = AuthFg,
                    modifier = Modifier.clickable { onRegister() }.then(
                        Modifier.drawWithContent {
                            drawContent()
                            drawLine(
                                color = AuthAccent,
                                start = Offset(0f, size.height),
                                end = Offset(size.width, size.height),
                                strokeWidth = 2.dp.toPx(),
                                cap = StrokeCap.Square
                            )
                        }
                    )
                )
            }
        }
    }
}

@Composable
private fun InputGroup(
    label: String,
    content: @Composable () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(Spacing.sm)) {
        Text(
            text = label.uppercase(),
            fontSize = 13.sp,
            fontWeight = FontWeight.Black,
            color = AuthFg
        )
        content()
    }
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
                        .borderExtra(3.dp, AuthFg, RoundedCornerShape(10.dp))
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
private fun SocialButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: @Composable (() -> Unit)? = null
) {
    Box(modifier = modifier.clickable { onClick() }) {
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
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Box(modifier = Modifier.size(18.dp)) { icon() }
                Spacer(Modifier.width(Spacing.sm))
            }
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
private fun GoogleIcon() {
    Canvas(modifier = Modifier.size(18.dp)) {
        val cx = size.width / 2f
        val cy = size.height / 2f
        val r = size.width * 0.42f
        drawCircle(Color(0xFF4285F4), radius = r * 1.15f, center = Offset(cx, cy))
        val g = Path().apply {
            moveTo(cx + r * 0.1f, cy - r * 0.1f)
            lineTo(cx + r * 0.9f, cy - r * 0.4f)
            lineTo(cx + r * 0.5f, cy + r * 0.6f)
            lineTo(cx - r * 0.2f, cy + r * 0.3f)
            close()
        }
        drawPath(g, Color.White)
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
private fun LoginScreenPreview() {
    TrainlyTheme {
        LoginScreen(
            onRegister = {},
            onSuccess = {}
        )
    }
}

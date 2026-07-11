package com.himischa.jobmemo.service;

import com.himischa.jobmemo.dto.auth.AuthResponse;
import com.himischa.jobmemo.dto.auth.LoginRequest;
import com.himischa.jobmemo.dto.auth.RegisterRequest;
import com.himischa.jobmemo.exception.DuplicateEmailException;
import com.himischa.jobmemo.model.User;
import com.himischa.jobmemo.repository.UserRepository;
import com.himischa.jobmemo.security.JwtUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-pass");
        when(jwtUtil.generateToken("john@example.com")).thenReturn("jwt-token");

        User savedUser = new User();
        savedUser.setName("John Doe");
        savedUser.setEmail("john@example.com");
        savedUser.setPassword("encoded-pass");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("john@example.com", response.getEmail());
        assertEquals("John Doe", response.getName());

        verify(userRepository).existsByEmail("john@example.com");
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("john@example.com");
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateEmailException.class, () -> authService.register(request));

        verify(userRepository).existsByEmail("john@example.com");
        verify(userRepository, never()).save(any());
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setName("John Doe");
        user.setEmail("john@example.com");
        user.setPassword("encoded-pass");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "encoded-pass")).thenReturn(true);
        when(jwtUtil.generateToken("john@example.com")).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.getToken());
        assertEquals("john@example.com", response.getEmail());
        assertEquals("John Doe", response.getName());

        verify(userRepository).findByEmail("john@example.com");
        verify(passwordEncoder).matches("password123", "encoded-pass");
        verify(jwtUtil).generateToken("john@example.com");
    }

    @Test
    void login_WrongPassword_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("john@example.com");
        request.setPassword("wrong-password");

        User user = new User();
        user.setEmail("john@example.com");
        user.setPassword("encoded-pass");

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-pass")).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid email or password", exception.getMessage());

        verify(userRepository).findByEmail("john@example.com");
        verify(passwordEncoder).matches("wrong-password", "encoded-pass");
        verify(jwtUtil, never()).generateToken(any());
    }

    @Test
    void login_UnknownEmail_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@example.com");
        request.setPassword("password123");

        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> authService.login(request));
        assertEquals("Invalid email or password", exception.getMessage());

        verify(userRepository).findByEmail("unknown@example.com");
        verify(passwordEncoder, never()).matches(any(), any());
        verify(jwtUtil, never()).generateToken(any());
    }
}
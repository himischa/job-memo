package com.himischa.jobmemo.controller;

import com.himischa.jobmemo.dto.application.ApplicationRequest;
import com.himischa.jobmemo.dto.auth.LoginRequest;
import com.himischa.jobmemo.dto.auth.RegisterRequest;
import com.himischa.jobmemo.model.ApplicationStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authToken;

    @BeforeEach
    void setUp() throws Exception {
        // Register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        // Login to get token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        var result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = result.getResponse().getContentAsString();
        authToken = objectMapper.readTree(responseBody).get("token").asText();
    }

    @Test
    void getApplications_WithoutAuth_Returns401Or403() throws Exception {
        mockMvc.perform(get("/api/applications"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void createApplication_WithoutAuth_Returns401Or403() throws Exception {
        ApplicationRequest request = new ApplicationRequest();
        request.setCompany("Google");
        request.setPosition("Software Engineer");
        request.setStatus(ApplicationStatus.APPLIED);

        mockMvc.perform(post("/api/applications")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    void createApplication_WithAuth_Returns201() throws Exception {
        ApplicationRequest request = new ApplicationRequest();
        request.setCompany("Google");
        request.setPosition("Software Engineer");
        request.setStatus(ApplicationStatus.APPLIED);

        mockMvc.perform(post("/api/applications")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.company").value("Google"))
                .andExpect(jsonPath("$.position").value("Software Engineer"))
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void getApplications_WithAuth_Returns200() throws Exception {
        // First create an application
        ApplicationRequest request = new ApplicationRequest();
        request.setCompany("Google");
        request.setPosition("Software Engineer");
        request.setStatus(ApplicationStatus.APPLIED);

        mockMvc.perform(post("/api/applications")
                .header("Authorization", "Bearer " + authToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        // Then list applications
        mockMvc.perform(get("/api/applications")
                .header("Authorization", "Bearer " + authToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].company").value("Google"))
                .andExpect(jsonPath("$[0].position").value("Software Engineer"));
    }
}

package com.infosys.realestate.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.infosys.realestate.dto.LoginRequest;
import com.infosys.realestate.dto.UserRequestDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testLoginFailure() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setEmail("wrong@example.com");
        req.setPassword("wrongpass");

        mockMvc.perform(post("/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void testAdminRegistrationBlocked() throws Exception {
        UserRequestDTO req = new UserRequestDTO();
        req.setName("Sneaky Admin");
        req.setEmail("sneaky@admin.com");
        req.setPassword("pass123");
        req.setRole("ADMIN");

        mockMvc.perform(post("/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }
}


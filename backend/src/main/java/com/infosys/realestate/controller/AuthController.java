package com.infosys.realestate.controller;

import com.infosys.realestate.dto.LoginRequest;
import com.infosys.realestate.dto.LoginResponse;
import com.infosys.realestate.dto.UserRequestDTO;
import com.infosys.realestate.dto.UserResponseDTO;
import com.infosys.realestate.security.CustomUserDetailsService;
import com.infosys.realestate.security.JwtService;
import com.infosys.realestate.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;
    private final UserService userService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            CustomUserDetailsService userDetailsService,
            UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(request.getEmail());

        String token = jwtService.generateToken(userDetails);

        return new LoginResponse(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRequestDTO request) {
        if (request.getRole() != null &&
            (request.getRole().equalsIgnoreCase("ADMIN") ||
             request.getRole().equalsIgnoreCase("ADMINISTRATOR") ||
             request.getRole().equalsIgnoreCase("SYSTEM ADMIN"))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Registration as Administrator is not permitted."));
        }
        UserResponseDTO created = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
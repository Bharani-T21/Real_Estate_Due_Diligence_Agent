package com.infosys.realestate.service;

import com.infosys.realestate.dto.UserRequestDTO;
import com.infosys.realestate.dto.UserResponseDTO;
import com.infosys.realestate.entity.Role;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.exception.ResourceNotFoundException;
import com.infosys.realestate.repository.RoleRepository;
import com.infosys.realestate.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {
        String reqRole = userRequestDTO.getRole();
        if (reqRole != null && (reqRole.equalsIgnoreCase("ADMIN") || reqRole.equalsIgnoreCase("ADMINISTRATOR") || reqRole.equalsIgnoreCase("SYSTEM ADMIN"))) {
            throw new IllegalArgumentException("Registration as Administrator is not permitted.");
        }

        User user = new User();
        user.setName(userRequestDTO.getName());
        user.setEmail(userRequestDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userRequestDTO.getPassword()));

        Role assignedRole = null;
        if (reqRole != null && !reqRole.trim().isEmpty()) {
            assignedRole = roleRepository.findByRoleName(reqRole.toUpperCase()).orElse(null);
        }
        if (assignedRole == null) {
            assignedRole = roleRepository.findByRoleName("BUYER").orElseGet(() ->
                roleRepository.findByRoleName("USER").orElse(null)
            );
        }
        user.setRole(assignedRole);

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole() != null ? savedUser.getRole().getRoleName() : null
        );
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDTO(
                        user.getUserId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole() != null ? user.getRole().getRoleName() : null
                ))
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getRoleName() : null
        );
    }

    @Override
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
    }

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserResponseDTO(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getRoleName() : null
        );
    }
}


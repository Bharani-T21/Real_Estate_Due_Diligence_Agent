package com.infosys.realestate.controller;

import com.infosys.realestate.dto.PermitInfoDTO;
import com.infosys.realestate.service.PermitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permits")
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class PermitController {
    @Autowired
    private PermitService permitService;

    @GetMapping("/{id}")
    public ResponseEntity<PermitInfoDTO> getPermitInfo(@PathVariable Long id) {
        return ResponseEntity.ok(permitService.getPermitInfo(id));
    }
}

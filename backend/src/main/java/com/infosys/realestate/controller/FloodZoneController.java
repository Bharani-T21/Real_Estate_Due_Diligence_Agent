package com.infosys.realestate.controller;

import com.infosys.realestate.dto.FloodZoneInfoDTO;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/flood-zone")
@CrossOrigin(origins = "*")
@PreAuthorize("isAuthenticated()")
public class FloodZoneController {
    @Autowired
    private FloodZoneService floodZoneService;

    @GetMapping("/{id}")
    public ResponseEntity<FloodZoneInfoDTO> getFloodZoneInfo(@PathVariable Long id) {
        return ResponseEntity.ok(floodZoneService.getFloodZoneInfo(id));
    }
}

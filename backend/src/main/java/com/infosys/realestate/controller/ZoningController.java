package com.infosys.realestate.controller;

import com.infosys.realestate.dto.ZoningInfoDTO;
import com.infosys.realestate.service.ZoningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/zoning")
public class ZoningController {

    private final ZoningService zoningService;

    @Autowired
    public ZoningController(ZoningService zoningService) {
        this.zoningService = zoningService;
    }

    @GetMapping("/{propertyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ZoningInfoDTO> getZoningInfo(@PathVariable String propertyId) {
        return ResponseEntity.ok(zoningService.getZoningInfoByPropertyId(propertyId));
    }
}

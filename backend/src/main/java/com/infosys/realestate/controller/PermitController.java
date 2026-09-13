package com.infosys.realestate.controller;

import com.infosys.realestate.dto.PermitRequest;
import com.infosys.realestate.dto.PermitResponse;
import com.infosys.realestate.service.PermitService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permits")
@CrossOrigin(origins = "*")
public class PermitController {

    private final PermitService permitService;

    public PermitController(PermitService permitService) {
        this.permitService = permitService;
    }

    @GetMapping("/{propertyId}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('USER')")
    public ResponseEntity<List<PermitResponse>> getPermits(
            @PathVariable Long propertyId) {

        return ResponseEntity.ok(
                permitService.getPermitsByPropertyId(propertyId)
        );
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<PermitResponse> createPermit(
            @RequestBody PermitRequest request) {

        return ResponseEntity.ok(
                permitService.createPermit(request)
        );
    }
}

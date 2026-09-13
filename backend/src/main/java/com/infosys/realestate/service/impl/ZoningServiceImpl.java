package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.ZoningInfoDTO;
import com.infosys.realestate.service.ZoningService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ZoningServiceImpl implements ZoningService {

    @Override
    public ZoningInfoDTO getZoningInfoByPropertyId(String propertyId) {
        ZoningInfoDTO dto = new ZoningInfoDTO();
        dto.setPropertyId(propertyId);
        dto.setLastReviewDate(LocalDate.now());
        dto.setCompliance("Compliant");
        
        switch (propertyId) {
            case "P1":
                dto.setZoneType("R2A");
                dto.setPermittedUses("Residential");
                break;
            case "P2":
                dto.setZoneType("C3");
                dto.setPermittedUses("Commercial");
                break;
            case "P3":
                dto.setZoneType("R1");
                dto.setPermittedUses("Residential Single-Family");
                break;
            case "P4":
                dto.setZoneType("Z4");
                dto.setPermittedUses("Mixed Use");
                break;
            default:
                dto.setZoneType("Unknown");
                dto.setPermittedUses("Unknown");
                dto.setCompliance("Unknown");
                break;
        }
        return dto;
    }
}

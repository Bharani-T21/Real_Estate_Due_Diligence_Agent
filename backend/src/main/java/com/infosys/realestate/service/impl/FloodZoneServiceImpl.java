package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.FloodZoneInfoDTO;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {
    @Override
    public FloodZoneInfoDTO getFloodZoneInfo(Long propertyId) {
        if (propertyId == 1L) return new FloodZoneInfoDTO(1L, "Zone X", "Low", false);
        if (propertyId == 2L) return new FloodZoneInfoDTO(2L, "Zone AE", "Moderate", true);
        if (propertyId == 3L) return new FloodZoneInfoDTO(3L, "Zone A", "Moderate-High", true);
        if (propertyId == 4L) return new FloodZoneInfoDTO(4L, "Zone VE", "HIGH", true);
        return new FloodZoneInfoDTO(propertyId, "Zone X", "Low", false);
    }
}

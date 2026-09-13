package com.infosys.realestate.service;

import com.infosys.realestate.dto.FloodZoneInfoDTO;

public interface FloodZoneService {
    FloodZoneInfoDTO getFloodZoneInfo(Long propertyId);
}

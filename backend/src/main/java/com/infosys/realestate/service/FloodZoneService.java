package com.infosys.realestate.service;

import com.infosys.realestate.dto.FloodZoneResponse;

public interface FloodZoneService {

    FloodZoneResponse getFloodZoneByPropertyId(Long propertyId);
}

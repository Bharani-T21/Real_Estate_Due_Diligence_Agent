package com.infosys.realestate.service;

import com.infosys.realestate.dto.ZoningRequest;
import com.infosys.realestate.dto.ZoningResponse;

public interface ZoningService {

    ZoningResponse getZoningByPropertyId(Long propertyId);

    ZoningResponse createZoning(ZoningRequest request);

    ZoningResponse updateZoning(Long propertyId, ZoningRequest request);
}

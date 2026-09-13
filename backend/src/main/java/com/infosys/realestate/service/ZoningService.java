package com.infosys.realestate.service;

import com.infosys.realestate.dto.ZoningInfoDTO;

public interface ZoningService {
    ZoningInfoDTO getZoningInfoByPropertyId(String propertyId);
}

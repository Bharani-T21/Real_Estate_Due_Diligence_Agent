package com.infosys.realestate.service;

import com.infosys.realestate.dto.PermitInfoDTO;

public interface PermitService {
    PermitInfoDTO getPermitInfo(Long propertyId);
}

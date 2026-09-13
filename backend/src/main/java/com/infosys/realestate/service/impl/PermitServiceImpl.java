package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.PermitInfoDTO;
import com.infosys.realestate.service.PermitService;
import org.springframework.stereotype.Service;

@Service
public class PermitServiceImpl implements PermitService {
    @Override
    public PermitInfoDTO getPermitInfo(Long propertyId) {
        if (propertyId == 1L) return new PermitInfoDTO(1L, "Approved", "CLEAR", "Phase I Clear", "No issues");
        if (propertyId == 2L) return new PermitInfoDTO(2L, "Approved", "LOW", "Phase I Clear", "Minor notes");
        if (propertyId == 3L) return new PermitInfoDTO(3L, "Pending", "MEDIUM", "Phase I Complete", "Needs review");
        if (propertyId == 4L) return new PermitInfoDTO(4L, "Violation", "HIGH", "Phase II Required", "Active violation");
        return new PermitInfoDTO(propertyId, "Approved", "CLEAR", "Phase I Clear", "No issues");
    }
}

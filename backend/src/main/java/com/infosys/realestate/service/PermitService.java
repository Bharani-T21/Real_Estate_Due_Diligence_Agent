package com.infosys.realestate.service;

import com.infosys.realestate.dto.PermitRequest;
import com.infosys.realestate.dto.PermitResponse;

import java.util.List;

public interface PermitService {

    List<PermitResponse> getPermitsByPropertyId(Long propertyId);

    PermitResponse createPermit(PermitRequest request);
}

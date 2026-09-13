package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.ZoningRequest;
import com.infosys.realestate.dto.ZoningResponse;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.Zoning;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.ZoningRepository;
import com.infosys.realestate.service.ZoningService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ZoningServiceImpl implements ZoningService {

    @Autowired
    private ZoningRepository zoningRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public ZoningResponse getZoningByPropertyId(Long propertyId) {

        Zoning zoning = zoningRepository
                .findByProperty_PropertyId(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Zoning information not found for property id: "
                                        + propertyId
                        )
                );

        return convertToResponse(zoning);
    }

    @Override
    public ZoningResponse createZoning(ZoningRequest request) {

        Property property = propertyRepository
                .findById(request.getPropertyId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Property not found with id: "
                                        + request.getPropertyId()
                        )
                );

        if (zoningRepository
                .findByProperty_PropertyId(request.getPropertyId())
                .isPresent()) {

            throw new RuntimeException(
                    "Zoning information already exists for property id: "
                            + request.getPropertyId()
            );
        }

        Zoning zoning = new Zoning();

        zoning.setProperty(property);

        zoning.setZoningCategory(request.getZoningCategory());
        zoning.setZoningClass(request.getZoningClass());
        zoning.setPlanningAuthority(request.getPlanningAuthority());
        zoning.setMasterPlan(request.getMasterPlan());
        zoning.setParcelIdentifier(request.getParcelIdentifier());
        zoning.setComplianceStatus(request.getComplianceStatus());

        zoning.setMaxFar(request.getMaxFar());
        zoning.setMaxHeight(request.getMaxHeight());
        zoning.setGroundCoverage(request.getGroundCoverage());
        zoning.setMinPlotArea(request.getMinPlotArea());

        zoning.setFrontSetback(request.getFrontSetback());
        zoning.setRearSetback(request.getRearSetback());
        zoning.setLeftSetback(request.getLeftSetback());
        zoning.setRightSetback(request.getRightSetback());

        zoning.setPermittedUsage(request.getPermittedUsage());
        zoning.setRestrictedUsage(request.getRestrictedUsage());
        zoning.setSpecialRegulations(request.getSpecialRegulations());

        Zoning savedZoning = zoningRepository.save(zoning);

        return convertToResponse(savedZoning);
    }

    @Override
    public ZoningResponse updateZoning(
            Long propertyId,
            ZoningRequest request) {

        Zoning zoning = zoningRepository
                .findByProperty_PropertyId(propertyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Zoning information not found for property id: "
                                        + propertyId
                        )
                );

        zoning.setZoningCategory(request.getZoningCategory());
        zoning.setZoningClass(request.getZoningClass());
        zoning.setPlanningAuthority(request.getPlanningAuthority());
        zoning.setMasterPlan(request.getMasterPlan());
        zoning.setParcelIdentifier(request.getParcelIdentifier());
        zoning.setComplianceStatus(request.getComplianceStatus());

        zoning.setMaxFar(request.getMaxFar());
        zoning.setMaxHeight(request.getMaxHeight());
        zoning.setGroundCoverage(request.getGroundCoverage());
        zoning.setMinPlotArea(request.getMinPlotArea());

        zoning.setFrontSetback(request.getFrontSetback());
        zoning.setRearSetback(request.getRearSetback());
        zoning.setLeftSetback(request.getLeftSetback());
        zoning.setRightSetback(request.getRightSetback());

        zoning.setPermittedUsage(request.getPermittedUsage());
        zoning.setRestrictedUsage(request.getRestrictedUsage());
        zoning.setSpecialRegulations(request.getSpecialRegulations());

        Zoning updatedZoning = zoningRepository.save(zoning);

        return convertToResponse(updatedZoning);
    }

    private ZoningResponse convertToResponse(Zoning zoning) {

        ZoningResponse response = new ZoningResponse();

        response.setZoningId(zoning.getZoningId());

        if (zoning.getProperty() != null) {

            response.setPropertyId(
                    zoning.getProperty().getPropertyId()
            );

            response.setPropertyName(
                    zoning.getProperty().getPropertyName()
            );

            response.setAddress(
                    zoning.getProperty().getAddress()
            );

            response.setCity(
                    zoning.getProperty().getCity()
            );

            response.setState(
                    zoning.getProperty().getState()
            );
        }

        response.setZoningCategory(zoning.getZoningCategory());
        response.setZoningClass(zoning.getZoningClass());
        response.setPlanningAuthority(zoning.getPlanningAuthority());
        response.setMasterPlan(zoning.getMasterPlan());
        response.setParcelIdentifier(zoning.getParcelIdentifier());
        response.setComplianceStatus(zoning.getComplianceStatus());

        response.setMaxFar(zoning.getMaxFar());
        response.setMaxHeight(zoning.getMaxHeight());
        response.setGroundCoverage(zoning.getGroundCoverage());
        response.setMinPlotArea(zoning.getMinPlotArea());

        response.setFrontSetback(zoning.getFrontSetback());
        response.setRearSetback(zoning.getRearSetback());
        response.setLeftSetback(zoning.getLeftSetback());
        response.setRightSetback(zoning.getRightSetback());

        response.setPermittedUsage(zoning.getPermittedUsage());
        response.setRestrictedUsage(zoning.getRestrictedUsage());
        response.setSpecialRegulations(
                zoning.getSpecialRegulations()
        );

        return response;
    }
}

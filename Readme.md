
# ipm package: device-analytics

## Overview

Analytics for IoT Devices and Datafeeds

This is an ipm package, which contains one or more reusable assets within the ipm Community. The 'package.json' in this repo is a ipm spec's package.json, [here](https://docs.clearblade.com/v/3/6-ipm/spec), which is a superset of npm's package.json spec, [here](https://docs.npmjs.com/files/package.json).

[Browse ipm Packages](https://ipm.clearblade.com)

## Setup

Not required

## API

Device Analytics Configuration page walks you through configuring the Analytics

## Usage

### Portals

`DeviceAnalytics` - Configurable Device Analytics Report

### Code Services

`AnalyticsMessageProcessor` - Processes mqtt messages and creates analytics entries
`AnalyticsSaveConfiguration` - Updates analytics configurations
`AnalyticsFetch` - Returns Analytics datasets for a particular Analytics Configuration

### Code Libraries

`DeviceAnalyticsUtil` - Logic for analytics types
`q` - Promise Library

### Collections

`	AnalyticsConfiguration`
`	AnalyticsEntries`

## Thank you

Powered by ClearBlade Enterprise IoT Platform: [https://platform.clearblade.com](https://platform.clearblade.com)

import React from 'react';
import { Image } from 'react-native';

type IconProps = { color: string; size?: number };

export function HomeIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/Home.png')} style={{ width: size, height: size, tintColor: color }} />;
}

export function ProfileIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/Profile.png')} style={{ width: size, height: size, tintColor: color }} />;
}

export function DonateIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/Donate.png')} style={{ width: size, height: size, tintColor: color }} />;
}

export function EventIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/Events.png')} style={{ width: size, height: size, tintColor: color }} />;
}

export function CreateEventIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/CreateEvent.png')} style={{ width: size, height: size, tintColor: color }} />;
}

export function NotifyIcon({ color, size = 24 }: IconProps) {
  return <Image source={require('../../../../shared/icons/Events.png')} style={{ width: size, height: size, tintColor: color }} />;
}

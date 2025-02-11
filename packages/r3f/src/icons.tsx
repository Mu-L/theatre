import {BsCameraVideoFill, BsFillCollectionFill} from 'react-icons/bs'
import {GiCube, GiLightBulb, GiLightProjector} from 'react-icons/gi'
import {BiSun} from 'react-icons/bi'
import React from 'react'

const icons = {
  collection: <BsFillCollectionFill />,
  cube: <GiCube />,
  lightBulb: <GiLightBulb />,
  spotLight: <GiLightProjector />,
  sun: <BiSun />,
  camera: <BsCameraVideoFill />,
}

export type IconID = keyof typeof icons

export default icons

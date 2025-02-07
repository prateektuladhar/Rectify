import { Redirect } from "expo-router";

import 'setimmediate';


export default function Index() {
  return <Redirect href={'/home'}/>
}

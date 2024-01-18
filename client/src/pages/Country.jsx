import { useParams } from "react-router-dom"

export default function Country() {
    const {selector, country} = useParams()
    console.log(selector)

  return (
    <div>
        <div>
            {selector}
        </div>
        <div>
            {country}
        </div>
    </div>
  )
}

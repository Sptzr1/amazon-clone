import Image from "next/image"

export default function PlaceholderImage({ category, subcategory, width = 300, height = 300, ...props }) {
  // Usamos una URL de placeholder genérica que siempre funciona
  const placeholderUrl = `https://placehold.co/${width}x${height}/CCCCCC/333333?text=${category || "Product"}`

  return (
    <Image
      src={placeholderUrl || "/placeholder.svg"}
      alt={props.alt || `${category || ""} ${subcategory || ""}`}
      width={width}
      height={height}
      {...props}
    />
  )
}

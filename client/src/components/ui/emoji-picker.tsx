
import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

import { cn } from "@/lib/utils"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  className?: string
}

export function EmojiPicker({ onEmojiSelect, className }: EmojiPickerProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Content
        className={cn(
          "z-50 w-[352px] rounded-lg border bg-popover p-0 text-popover-foreground shadow-md outline-none",
          className
        )}
        sideOffset={5}
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: any) => onEmojiSelect(emoji.native)}
          theme="light"
          set="native"
        />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  )
}

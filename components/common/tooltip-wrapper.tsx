import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface TooltipWrapperProps {
    tooltipText: string;
    children: ReactNode; // Accepts any React element
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({ tooltipText, children }) => {
    return (

        <Tooltip>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent>
                {tooltipText}
            </TooltipContent>
        </Tooltip>
    );
};

export default TooltipWrapper;

import React from 'react';
import { Eye, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const StudentActions = ({ studentId, onView, onEdit, onDelete }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          aria-label="Open student actions"
        >
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onSelect={() => onView(studentId)}>
          <Eye className="mr-2 h-4 w-4 text-blue-600" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onEdit(studentId)}>
          <Edit className="mr-2 h-4 w-4 text-green-600" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onSelect={() => onDelete(studentId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentActions;
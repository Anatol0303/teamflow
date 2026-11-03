import {
    IsString,
    Length,
    Matches
} from 'class-validator';

export class CreateTeamDto {
    @IsString()
    @Length(1, 100)
    @Matches(/\S/, {
        message: 'name must contain at least one non-whitespace character'
    })
    name!: string;
}